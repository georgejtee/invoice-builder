export type OutputCurrency = 'USD' | 'ZAR' | 'RTGS';

export interface PriceInputs {
  /** Base cost of the item in ZAR (rand), before any VAT or transport. */
  randCost: number;
  /** Quantity ordered. */
  qty: number;
  /** Transport/freight multiplier. Default 1.25. */
  transportFactor?: number;
  /** Divisor used to convert ZAR → USD. Default 15. */
  exchangeDivisor?: number;
  /** Profit multiplier applied to raw USD amount. Default 1.35. */
  profitMultiplier?: number;
  /** VAT rate applied to USD-inc-profit amount. Default 0.155. */
  usdVatRate?: number;
  /** USD → RTGS/ZWL exchange rate. Default 36. */
  rtgsRate?: number;
  /** Desired output currency. Default "USD". */
  currency?: OutputCurrency;
}

export interface PriceBreakdown {
  randCost: number;
  randVat: number;
  randTotal: number;
  transport: number;
  usdConversion: number;
  usdIncProfit: number;
  usdVat: number;
  usdTotal: number;
  rtgsTotal: number;
}

export interface PriceResult {
  currency: OutputCurrency;
  unitPrice: number;
  lineTotal: number;
  breakdown: PriceBreakdown;
}

function r(value: number): number {
  return Math.round(value * 1_000_000) / 1_000_000;
}

export function computePrice(inputs: PriceInputs): PriceResult {
  const {
    randCost,
    qty,
    transportFactor = 1.25,
    exchangeDivisor = 15,
    profitMultiplier = 1.35,
    usdVatRate = 0.155,
    rtgsRate = 36,
    currency = 'USD'
  } = inputs;

  const randVat = r(randCost * 0.15);
  const randTotal = r(randCost + randVat);
  const transport = r(randTotal * transportFactor);
  const usdConversion = r(transport / exchangeDivisor);
  const usdIncProfit = r(usdConversion * profitMultiplier);
  const usdVat = r(usdIncProfit * usdVatRate);
  const usdTotal = r(usdIncProfit + usdVat);
  const rtgsTotal = r(usdTotal * rtgsRate);

  let unitPrice: number;
  switch (currency) {
    case 'ZAR':
      unitPrice = randTotal;
      break;
    case 'RTGS':
      unitPrice = rtgsTotal;
      break;
    case 'USD':
    default:
      unitPrice = usdTotal;
  }

  return {
    currency,
    unitPrice: r(unitPrice),
    lineTotal: r(unitPrice * qty),
    breakdown: {
      randCost: r(randCost),
      randVat,
      randTotal,
      transport,
      usdConversion,
      usdIncProfit,
      usdVat,
      usdTotal,
      rtgsTotal
    }
  };
}
