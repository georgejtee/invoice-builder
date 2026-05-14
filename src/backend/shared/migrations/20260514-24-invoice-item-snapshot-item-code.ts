import type { DatabaseAdapter } from '../types/DatabaseAdapter';
import { getTableColumns } from '../utils/dbHelper';
import { mapDatabaseError } from '../utils/errorFunctions';

export const up = async (db: DatabaseAdapter) => {
  try {
    const cols = await getTableColumns(db, 'invoice_item_snapshots');
    const hasCode = cols.some(c => c.name === 'code');

    if (!hasCode) {
      await db.run(
        `
          ALTER TABLE invoice_item_snapshots
          ADD COLUMN "code" TEXT
        `
      );
    }

    await db.run(`
      UPDATE invoice_item_snapshots
      SET "code" = (
        SELECT i."code"
        FROM items i
        INNER JOIN invoice_items ii ON ii."itemId" = i."id"
        WHERE ii."id" = invoice_item_snapshots."parentInvoiceItemId"
      )
      WHERE "code" IS NULL OR "code" = ''
    `);
  } catch (error) {
    return { success: false, ...mapDatabaseError(error, db.type) };
  }
};
