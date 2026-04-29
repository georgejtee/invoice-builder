import type { DatabaseAdapter } from '../types/DatabaseAdapter';
import { getTableColumns } from '../utils/dbHelper';
import { mapDatabaseError } from '../utils/errorFunctions';

export const up = async (db: DatabaseAdapter) => {
  try {
    const cols = await getTableColumns(db, 'items');
    const hasBrand = cols.some(c => c.name === 'brand');
    const hasCurrencyId = cols.some(c => c.name === 'currencyId');
    const hasCode = cols.some(c => c.name === 'code');

    if (!hasBrand) {
      await db.run(
        `
          ALTER TABLE items
          ADD COLUMN "brand" TEXT
        `
      );
    }

    if (!hasCurrencyId) {
      await db.run(
        `
          ALTER TABLE items
          ADD COLUMN "currencyId" INTEGER
        `
      );
    }

    if (!hasCode) {
      await db.run(
        `
          ALTER TABLE items
          ADD COLUMN "code" TEXT
        `
      );
    }
    await db.run(`CREATE INDEX IF NOT EXISTS idx_items_currencyId ON items("currencyId")`);
  } catch (error) {
    return { success: false, ...mapDatabaseError(error, db.type) };
  }
};
