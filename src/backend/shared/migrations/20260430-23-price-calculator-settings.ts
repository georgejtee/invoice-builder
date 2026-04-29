import type { DatabaseAdapter } from '../types/DatabaseAdapter';
import { getTableColumns } from '../utils/dbHelper';
import { mapDatabaseError } from '../utils/errorFunctions';

export const up = async (db: DatabaseAdapter) => {
  try {
    const cols = await getTableColumns(db, 'settings');
    const colNames = cols.map(c => c.name);

    const additions: [string, string][] = [
      ['pcTransportFactor', 'REAL DEFAULT 1.25'],
      ['pcExchangeDivisor', 'REAL DEFAULT 15'],
      ['pcProfitMultiplier', 'REAL DEFAULT 1.35'],
      ['pcUsdVatRate', 'REAL DEFAULT 0.155'],
      ['pcRtgsRate', 'REAL DEFAULT 36'],
      ['pcDefaultCurrency', `TEXT DEFAULT 'USD'`]
    ];

    for (const [col, def] of additions) {
      if (!colNames.includes(col)) {
        await db.run(`ALTER TABLE settings ADD COLUMN "${col}" ${def}`);
      }
    }

    return { success: true };
  } catch (error) {
    return { success: false, ...mapDatabaseError(error, db.type) };
  }
};
