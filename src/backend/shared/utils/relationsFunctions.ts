import type { Item } from '../../shared/types/item';
import type { DatabaseAdapter } from '../types/DatabaseAdapter';

export const getOrCreateByName = async (
  db: DatabaseAdapter,
  table: 'units' | 'categories',
  name: string
): Promise<number | undefined> => {
  const row = await db.get(`SELECT "id" FROM ${table} WHERE "name" = ? LIMIT 1`, [name]);
  if (row?.id) return row.id as number;

  await db.run(`INSERT INTO ${table} ("name") VALUES (?)`, [name]);

  const newRow = await db.get(`SELECT id FROM ${table} WHERE "name" = ? LIMIT 1`, [name]);
  if (newRow?.id) return newRow.id as number;

  return undefined;
};

const getCurrencyIdByCode = async (db: DatabaseAdapter, code: string): Promise<number | undefined> => {
  const row = await db.get(`SELECT "id" FROM currencies WHERE "code" = ? LIMIT 1`, [code]);
  return row?.id ? (row.id as number) : undefined;
};

export const resolveItemRelations = async (db: DatabaseAdapter, data: Item): Promise<Item> => {
  const item = { ...data };

  if (typeof item.categoryId === 'undefined' && item.categoryName) {
    item.categoryId = await getOrCreateByName(db, 'categories', item.categoryName);
  }
  if (typeof item.unitId === 'undefined' && item.unitName) {
    item.unitId = await getOrCreateByName(db, 'units', item.unitName);
  }
  if (typeof item.currencyId === 'undefined' && item.currencyCode) {
    item.currencyId = await getCurrencyIdByCode(db, item.currencyCode);
  }

  return item;
};
