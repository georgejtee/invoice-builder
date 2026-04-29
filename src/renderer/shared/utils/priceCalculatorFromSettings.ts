import type { Settings } from '../types/settings';
import type { OutputCurrency } from './computePrice';

export const PC_DEFAULTS = {
  pcTransportFactor: 1.25,
  pcExchangeDivisor: 15,
  pcProfitMultiplier: 1.35,
  pcUsdVatRate: 0.155,
  pcRtgsRate: 36,
  pcDefaultCurrency: 'USD' as const
};

/** Map invoice currency code to the price calculator output bucket (USD / ZAR / RTGS). */
export function currencyCodeToOutputCurrency(code: string | undefined | null): OutputCurrency {
  const c = (code ?? 'USD').toUpperCase();
  if (c === 'ZAR') return 'ZAR';
  if (c === 'ZWL' || c === 'RTGS') return 'RTGS';
  return 'USD';
}

export function priceParamsFromSettings(s: Settings | null | undefined): {
  transportFactor: number;
  exchangeDivisor: number;
  profitMultiplier: number;
  usdVatRate: number;
  rtgsRate: number;
} {
  return {
    transportFactor: s?.pcTransportFactor ?? PC_DEFAULTS.pcTransportFactor,
    exchangeDivisor: s?.pcExchangeDivisor ?? PC_DEFAULTS.pcExchangeDivisor,
    profitMultiplier: s?.pcProfitMultiplier ?? PC_DEFAULTS.pcProfitMultiplier,
    usdVatRate: s?.pcUsdVatRate ?? PC_DEFAULTS.pcUsdVatRate,
    rtgsRate: s?.pcRtgsRate ?? PC_DEFAULTS.pcRtgsRate
  };
}

export function defaultOutputCurrencyFromSettings(s: Settings | null | undefined): OutputCurrency {
  const d = s?.pcDefaultCurrency;
  if (d === 'ZAR' || d === 'USD' || d === 'RTGS') return d;
  return 'USD';
}
