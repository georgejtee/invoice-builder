import fs from 'fs';
import path from 'path';
import { DatabaseType } from '../enums/databaseType';
import type { DatabaseAdapter } from '../types/DatabaseAdapter';
import { getColumnType, getDefaultValue } from '../utils/dbHelper';
import { mapDatabaseError } from '../utils/errorFunctions';

export const runMigrations = async (db: DatabaseAdapter, migrationsPath: string) => {
  let transactionStarted = false;
  // Track the migration we're currently executing so the catch block can
  // attribute the failure to a specific file, not just "some migration".
  let currentMigration: string | null = null;
  try {
    const files = fs
      .readdirSync(migrationsPath)
      .filter(f => /^\d{8}-\d{2}-.*\.(cjs|js|ts)$/.test(f))
      .sort();

    if (db.type === DatabaseType.sqlite) {
      await db.run('PRAGMA foreign_keys = OFF;');
    }
    await db.run('BEGIN');
    transactionStarted = true;

    await db.run(
      `
      CREATE TABLE IF NOT EXISTS migrations (
        "name" TEXT PRIMARY KEY,
        "appliedAt" ${getColumnType('DATETIME', db.type)} NOT NULL DEFAULT ${getDefaultValue("(datetime('now'))", db.type)}
      );
    `
    );

    for (const file of files) {
      const name = path.basename(file);

      const row = await db.get(`SELECT 1 FROM migrations WHERE "name" = ?`, [name]);

      if (!row) {
        const migrationPath = path.resolve(migrationsPath, file);
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const migration = require(migrationPath);
        if (typeof migration.up !== 'function') {
          throw new Error(`error.noUpFunction`);
        }
        if (migration.up) {
          currentMigration = name;
          console.log(`[migrations] applying ${name}`);
          await migration.up(db);
          await db.run(`INSERT INTO migrations("name") VALUES(?)`, [name]);
          currentMigration = null;
        }
      }
    }

    await db.run('COMMIT');

    if (db.type === DatabaseType.sqlite) {
      await db.run('PRAGMA foreign_keys = ON;');
    }
    return { success: true, message: undefined, data: undefined, key: undefined };
  } catch (error) {
    // Surface the underlying driver error with all the diagnostic fields
    // Postgres provides (column, table, constraint, detail, etc.). Without
    // this `mapDatabaseError` strips everything for known codes (e.g. 23502
    // NOT NULL) and we end up with a generic toast that doesn't identify
    // which row / column / migration is the actual culprit.
    const pgErr = error as {
      message?: string;
      code?: string;
      detail?: string;
      hint?: string;
      where?: string;
      position?: string;
      routine?: string;
      severity?: string;
      column?: string;
      table?: string;
      schema?: string;
      constraint?: string;
      dataType?: string;
    };
    console.error('[migrations] failed during migration:', currentMigration ?? '(pre/post-migration phase)', {
      message: pgErr?.message,
      code: pgErr?.code,
      detail: pgErr?.detail,
      hint: pgErr?.hint,
      schema: pgErr?.schema,
      table: pgErr?.table,
      column: pgErr?.column,
      constraint: pgErr?.constraint,
      dataType: pgErr?.dataType,
      where: pgErr?.where,
      position: pgErr?.position,
      routine: pgErr?.routine,
      severity: pgErr?.severity
    });

    if (transactionStarted) {
      try {
        await db.run('ROLLBACK');
      } catch (rollbackErr) {
        console.error('[migrations] rollback also failed:', rollbackErr);
        throw new Error(`error.rollbackFailed`);
      }
    }

    if (db.type === DatabaseType.sqlite) {
      await db.run('PRAGMA foreign_keys = ON;');
    }

    const mapped = mapDatabaseError(error, db.type);
    // Build a richer message so the toast tells the user *which* column,
    // *which* table and *which* migration. Falls back to whatever
    // mapDatabaseError already produced.
    const parts: string[] = [];
    if (currentMigration) parts.push(`migration=${currentMigration}`);
    if (pgErr?.table) parts.push(`table=${pgErr.table}`);
    if (pgErr?.column) parts.push(`column=${pgErr.column}`);
    if (pgErr?.constraint) parts.push(`constraint=${pgErr.constraint}`);
    if (pgErr?.detail) parts.push(`detail=${pgErr.detail}`);
    const enrichedMessage = parts.length > 0 ? `${pgErr?.message ?? mapped.key} | ${parts.join(' ')}` : mapped.message;

    return { success: false, ...mapped, message: enrichedMessage ?? mapped.message };
  }
};
