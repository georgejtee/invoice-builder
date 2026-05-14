export interface NCEItem {
  quantity: string;
  code: string;
  name: string;
  unitPrice: string;
  totalPrice: string;
}

export interface NCELayoutData {
  issuedAt?: string;
  refNumber: string;
  clientCompanyName: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  clientAddress: string;
  clientAdditional: string;
  businessName: string;
  businessAddress: string;
  businessEmail: string;
  businessPhone: string;
  businessAdditional: string;
  projectName: string;
  logoUrl?: string;
  items: NCEItem[];
  totalFormatted: string;
}
