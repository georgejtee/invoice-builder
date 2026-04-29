export interface Item {
  id: number;
  name: string;
  brand?: string;
  code?: string;
  amount?: string;
  unitId?: number;
  currencyId?: number;
  categoryId?: number;
  unitName?: string;
  categoryName?: string;
  currencyCode?: string;
  currencySymbol?: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  invoiceCount: number;
  quotesCount: number;
  isArchived: boolean;
}

export interface ItemAdd {
  name: string;
  brand?: string;
  amount?: string;
  unitId?: number;
  currencyId?: number;
  categoryId?: number;
  description?: string;
  categoryName?: string;
  unitName?: string;
  currencyCode?: string;
  isArchived: boolean;
}

export interface ItemUpdate extends ItemAdd {
  id: number;
}

export interface ItemFromData {
  id?: number;
  name: string;
  brand?: string;
  amount?: string;
  unitId?: number;
  currencyId?: number;
  categoryId?: number;
  description?: string;
  currencyCode?: string;
  code?: string;
  isArchived: boolean;
}
