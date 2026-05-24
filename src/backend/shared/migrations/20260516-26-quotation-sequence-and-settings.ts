import type { DatabaseAdapter } from '../types/DatabaseAdapter';
import { getTableColumns } from '../utils/dbHelper';
import { mapDatabaseError } from '../utils/errorFunctions';

export const up = async (db: DatabaseAdapter) => {
  try {
    const seqCols = await getTableColumns(db, 'invoice_sequences');
    if (!seqCols.some(c => c.name === 'nextQuotationSequence')) {
      await db.run(`
        ALTER TABLE invoice_sequences
        ADD COLUMN "nextQuotationSequence" BIGINT NOT NULL DEFAULT 1
      `);
    }

    await db.run(`
      UPDATE invoice_sequences AS seq
      SET "nextQuotationSequence" = COALESCE(
        (
          SELECT MAX(CAST(inv."invoiceNumber" AS INTEGER)) + 1
          FROM invoices inv
          WHERE inv."businessId" = seq."businessId"
            AND inv."clientId" = seq."clientId"
            AND inv."invoiceType" = 'quotation'
        ),
        1
      )
    `);

    const settingsCols = await getTableColumns(db, 'settings');
    if (!settingsCols.some(c => c.name === 'quotePrefix')) {
      await db.run(`ALTER TABLE settings ADD COLUMN "quotePrefix" TEXT`);
    }
    if (!settingsCols.some(c => c.name === 'quoteSuffix')) {
      await db.run(`ALTER TABLE settings ADD COLUMN "quoteSuffix" TEXT`);
    }

    await db.run(`UPDATE settings SET "quotePrefix" = 'NCE' WHERE "quotePrefix" IS NULL OR "quotePrefix" = ''`);
    await db.run(`UPDATE settings SET "quoteSuffix" = 'Q' WHERE "quoteSuffix" IS NULL OR "quoteSuffix" = ''`);
  } catch (error) {
    return { success: false, ...mapDatabaseError(error, db.type) };
  }
};
