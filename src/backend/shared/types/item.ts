export interface Item {
  id?: number;
  name: string;
  brand?: string;
  unitId?: number;
  currencyId?: number;
  amount?: string;
  categoryId?: number;
  categoryName?: string;
  unitName?: string;
  currencyCode?: string;
  currencySymbol?: string;
  description?: string;
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
  invoiceCount: number;
  quotesCount: number;
  code?: string;
}
