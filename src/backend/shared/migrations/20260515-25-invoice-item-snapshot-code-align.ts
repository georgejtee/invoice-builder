import type { DatabaseAdapter } from '../types/DatabaseAdapter';
import { getTableColumns } from '../utils/dbHelper';
import { mapDatabaseError } from '../utils/errorFunctions';

/**
 * Older builds may have created `itemCode` on this table; the canonical column is `code`.
 */
export const up = async (db: DatabaseAdapter) => {
  try {
    const cols = await getTableColumns(db, 'invoice_item_snapshots');
    const names = new Set(cols.map(c => c.name));

    if (!names.has('itemCode')) {
      return;
    }

    if (!names.has('code')) {
      await db.run(`
        ALTER TABLE invoice_item_snapshots
        ADD COLUMN "code" TEXT
      `);
    }

    await db.run(`
      UPDATE invoice_item_snapshots
      SET "code" = "itemCode"
      WHERE ("code" IS NULL OR "code" = '')
        AND "itemCode" IS NOT NULL
        AND "itemCode" != ''
    `);
  } catch (error) {
    return { success: false, ...mapDatabaseError(error, db.type) };
  }
};
