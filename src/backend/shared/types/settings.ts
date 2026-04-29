import type { AmountFormat } from '../enums/amountFormat';
import type { DateFormat } from '../enums/dateFormat';
import type { Language } from '../enums/language';

export interface Settings {
  id: number;
  language: Language;
  amountFormat: AmountFormat;
  dateFormat: DateFormat;
  isDarkMode: boolean;
  invoicePrefix?: string;
  invoiceSuffix?: string;
  shouldIncludeYear: boolean;
  shouldIncludeMonth: boolean;
  shouldIncludeBusinessName: boolean;
  quotesON: boolean;
  styleProfilesON: boolean;
  ublON: boolean;
  xrechnungON: boolean;
  presetsON: boolean;
  reportsON: boolean;
  /** Price calculator (NCE chain) defaults — see migration 20260430-23. */
  pcTransportFactor?: number;
  pcExchangeDivisor?: number;
  pcProfitMultiplier?: number;
  pcUsdVatRate?: number;
  pcRtgsRate?: number;
  pcDefaultCurrency?: string;
  createdAt: string;
  updatedAt: string;
}
