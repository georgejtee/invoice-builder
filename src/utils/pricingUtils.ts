// pricingUtils.js
export const calculateLandedPrice = (item: { randCost: number; transport: number; profitMargin: number }, settings: { exchangeRate: number; randVatRate: number; localVatRate: number }) => {
    const { randCost, transport, profitMargin } = item;
    const { exchangeRate, randVatRate, localVatRate } = settings;
  
    // 1. Rand Total = Cost + VAT (15%)
    const randVat = randCost * randVatRate;
    const randTotal = randCost + randVat;
  
    // 2. USD Conversion = (Rand Total + Transport) / Exchange Rate
    // Based on your sheet: (1723.85 + 21.57) / 1.35
    const usdConversion = (randTotal + transport) / exchangeRate;
  
    // 3. Add Profit Margin
    const priceWithProfit = usdConversion * (1 + profitMargin);
  
    // 4. Final USD Total with Local VAT
    const localVat = priceWithProfit * localVatRate;
    const finalTotal = priceWithProfit + localVat;
  
    return {
      randTotal: randTotal.toFixed(2),
      usdConversion: usdConversion.toFixed(2),
      usdTotal: finalTotal.toFixed(2),
      localVat: localVat.toFixed(2)
    };
  };