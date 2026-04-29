import CalculateIcon from '@mui/icons-material/Calculate';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Chip,
  Divider,
  Grid,
  Paper,
  Slider,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  Typography
} from '@mui/material';
import { useEffect, useState, type FC } from 'react';
import { useTranslation } from 'react-i18next';
import { OUTPUT_CURRENCY_CODES } from '../../shared/constants/priceCalculatorOptions';
import { computePrice, type OutputCurrency } from '../../shared/utils/computePrice';
import {
  defaultOutputCurrencyFromSettings,
  priceParamsFromSettings
} from '../../shared/utils/priceCalculatorFromSettings';
import { useAppSelector } from '../../state/configureStore';
import { selectSettings } from '../../state/pageSlice';

const CURRENCY_SYMBOLS: Record<OutputCurrency, string> = {
  USD: '$',
  ZAR: 'R',
  RTGS: 'ZWL'
};

function fmtNum(value: number, currency: OutputCurrency): string {
  const sym = CURRENCY_SYMBOLS[currency];
  const formatted = value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  return `${sym} ${formatted}`;
}

export const PriceCalculatorPage: FC = () => {
  const { t } = useTranslation();
  const storeSettings = useAppSelector(selectSettings);

  const [currency, setCurrency] = useState<OutputCurrency>('USD');
  const [randCost, setRandCost] = useState<number>(0);
  const [qty, setQty] = useState<number>(1);
  const [transportFactor, setTransportFactor] = useState<number>(1.25);
  const [exchangeDivisor, setExchangeDivisor] = useState<number>(15);
  const [profitMultiplier, setProfitMultiplier] = useState<number>(1.35);
  const [usdVatRate, setUsdVatRate] = useState<number>(0.155);
  const [rtgsRate, setRtgsRate] = useState<number>(36);

  useEffect(() => {
    if (!storeSettings) return;
    const p = priceParamsFromSettings(storeSettings);
    setTransportFactor(p.transportFactor);
    setExchangeDivisor(p.exchangeDivisor);
    setProfitMultiplier(p.profitMultiplier);
    setUsdVatRate(p.usdVatRate);
    setRtgsRate(p.rtgsRate);
    setCurrency(defaultOutputCurrencyFromSettings(storeSettings));
  }, [storeSettings]);

  const [result, setResult] = useState(() =>
    computePrice({
      randCost: 0,
      qty: 1,
      transportFactor: 1.25,
      exchangeDivisor: 15,
      profitMultiplier: 1.35,
      usdVatRate: 0.155,
      rtgsRate: 36,
      currency: 'USD'
    })
  );

  useEffect(() => {
    setResult(
      computePrice({
        randCost,
        qty,
        transportFactor,
        exchangeDivisor,
        profitMultiplier,
        usdVatRate,
        rtgsRate,
        currency
      })
    );
  }, [randCost, qty, currency, transportFactor, exchangeDivisor, profitMultiplier, usdVatRate, rtgsRate]);

  const breakdownRows = [
    {
      label: t('items.breakdown.randCost', 'Rand cost (base)'),
      value: `R ${result.breakdown.randCost.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    },
    {
      label: t('items.breakdown.randVat', 'ZAR VAT (15%)'),
      value: `R ${result.breakdown.randVat.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    },
    {
      label: t('items.breakdown.randTotal', 'ZAR total'),
      value: `R ${result.breakdown.randTotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    },
    {
      label: t('items.breakdown.transport', 'Transport (×{{f}})', { f: transportFactor }),
      value: `R ${result.breakdown.transport.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    },
    {
      label: t('items.breakdown.usdConversion', 'USD conversion (÷{{d}})', { d: exchangeDivisor }),
      value: `$ ${result.breakdown.usdConversion.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    },
    {
      label: t('items.breakdown.usdProfit', 'USD + profit (×{{m}})', { m: profitMultiplier }),
      value: `$ ${result.breakdown.usdIncProfit.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    },
    {
      label: t('items.breakdown.usdVat', 'USD VAT ({{r}}%)', { r: (usdVatRate * 100).toFixed(1) }),
      value: `$ ${result.breakdown.usdVat.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    },
    {
      label: t('items.breakdown.usdTotal', 'USD unit price'),
      value: `$ ${result.breakdown.usdTotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    },
    {
      label: t('items.breakdown.rtgsTotal', 'RTGS total (×{{r}})', { r: rtgsRate }),
      value: `ZWL ${result.breakdown.rtgsTotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    }
  ];

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', py: 2 }}>
      {/* Page header */}
      <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 3 }}>
        <CalculateIcon color="primary" sx={{ fontSize: 28 }} />
        <Box>
          <Typography variant="h5" fontWeight={700}>
            {t('menuItems.priceCalculator', 'Price Calculator')}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {t(
              'items.priceCalculatorHint',
              'NCE formula chain: ZAR base cost → VAT → transport → USD conversion → profit → output currency'
            )}
          </Typography>
        </Box>
      </Stack>

      <Grid container spacing={3}>
        {/* ── Left column: inputs ───────────────────────────────────── */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 2 }}>
            <Typography
              variant="subtitle2"
              fontWeight={600}
              gutterBottom
              sx={{ textTransform: 'uppercase', letterSpacing: '0.07em', fontSize: '0.7rem', color: 'text.secondary' }}
            >
              {t('items.itemDetails', 'Item details')}
            </Typography>

            <Stack spacing={2} sx={{ mt: 1.5 }}>
              <TextField
                label={t('items.randCostLabel', 'ZAR base cost (rand)')}
                type="number"
                value={randCost || ''}
                placeholder="0"
                onChange={e => setRandCost(Math.max(0, Number(e.target.value)))}
                inputProps={{ min: 0, step: 0.01 }}
                fullWidth
                size="small"
              />

              <Box>
                <Stack direction="row" justifyContent="space-between" alignItems="center" mb={0.5}>
                  <Typography variant="caption" color="text.secondary">
                    {t('common.qty', 'Qty')}
                  </Typography>
                  <TextField
                    size="small"
                    type="number"
                    value={qty}
                    onChange={e => setQty(Math.max(1, Math.round(Number(e.target.value))))}
                    inputProps={{ min: 1, style: { textAlign: 'center', width: 60, padding: '4px 8px' } }}
                  />
                </Stack>
                <Slider
                  value={qty}
                  min={1}
                  max={500}
                  step={1}
                  onChange={(_e, v) => setQty(v as number)}
                  valueLabelDisplay="auto"
                  size="small"
                />
              </Box>
            </Stack>

            <Divider sx={{ my: 2 }} />

            <Typography
              variant="subtitle2"
              fontWeight={600}
              gutterBottom
              sx={{ textTransform: 'uppercase', letterSpacing: '0.07em', fontSize: '0.7rem', color: 'text.secondary' }}
            >
              {t('items.pricingParams', 'Pricing parameters')}
            </Typography>

            <Stack spacing={1.5} sx={{ mt: 1.5 }}>
              <TextField
                size="small"
                label={t('items.transportFactor', 'Transport factor')}
                type="number"
                value={transportFactor}
                onChange={e => setTransportFactor(Math.max(0, Number(e.target.value)))}
                inputProps={{ min: 0, step: 0.01 }}
                fullWidth
              />

              <TextField
                size="small"
                label={t('items.exchangeDivisor', 'Exchange divisor (ZAR→USD)')}
                type="number"
                value={exchangeDivisor}
                onChange={e => setExchangeDivisor(Math.max(0.000001, Number(e.target.value)))}
                inputProps={{ min: 0.000001, step: 0.01 }}
                fullWidth
              />

              <TextField
                size="small"
                label={t('items.usdVatRate', 'USD VAT rate')}
                type="number"
                value={usdVatRate}
                onChange={e => setUsdVatRate(Math.max(0, Number(e.target.value)))}
                inputProps={{ min: 0, step: 0.001 }}
                fullWidth
              />

              <Stack direction="row" spacing={1.5}>
                <Tooltip title="Profit multiplier (cell M18)" arrow>
                  <TextField
                    size="small"
                    label={t('items.profitMultiplier', 'Profit multiplier')}
                    type="number"
                    value={profitMultiplier}
                    onChange={e => setProfitMultiplier(Math.max(1, Number(e.target.value)))}
                    inputProps={{ min: 1, step: 0.01 }}
                    fullWidth
                  />
                </Tooltip>
                <Tooltip title="USD → RTGS/ZWL rate (cell Q18)" arrow>
                  <TextField
                    size="small"
                    label={t('items.rtgsRate', 'RTGS rate')}
                    type="number"
                    value={rtgsRate}
                    onChange={e => setRtgsRate(Math.max(1, Number(e.target.value)))}
                    inputProps={{ min: 1, step: 0.5 }}
                    fullWidth
                  />
                </Tooltip>
              </Stack>
            </Stack>
          </Paper>
        </Grid>

        {/* ── Right column: results ─────────────────────────────────── */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Stack spacing={2}>
            {/* Currency selector */}
            <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
              <Typography
                variant="caption"
                color="text.secondary"
                fontWeight={600}
                sx={{
                  textTransform: 'uppercase',
                  letterSpacing: '0.07em',
                  fontSize: '0.7rem',
                  display: 'block',
                  mb: 1
                }}
              >
                {t('items.outputCurrency', 'Output currency')}
              </Typography>
              <ToggleButtonGroup
                value={currency}
                exclusive
                onChange={(_e, val) => {
                  if (val) setCurrency(val as OutputCurrency);
                }}
                size="small"
                fullWidth
              >
                {OUTPUT_CURRENCY_CODES.map(c => (
                  <ToggleButton key={c} value={c} sx={{ fontWeight: 700, fontSize: '0.8rem' }}>
                    {c}
                  </ToggleButton>
                ))}
              </ToggleButtonGroup>
            </Paper>

            {/* Result cards */}
            <Stack direction="row" spacing={2}>
              <Paper
                variant="outlined"
                sx={{
                  flex: 1,
                  p: 2,
                  borderRadius: 2,
                  textAlign: 'center',
                  borderColor: 'primary.main',
                  bgcolor: 'action.hover'
                }}
              >
                <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
                  {t('items.unitPrice', 'Unit price')}
                </Typography>
                <Typography variant="h5" fontWeight={700} color="primary">
                  {fmtNum(result.unitPrice, currency)}
                </Typography>
                <Chip
                  label={currency}
                  size="small"
                  color="primary"
                  variant="outlined"
                  sx={{ mt: 0.75, fontSize: '0.65rem' }}
                />
              </Paper>

              <Paper
                variant="outlined"
                sx={{
                  flex: 1,
                  p: 2,
                  borderRadius: 2,
                  textAlign: 'center',
                  borderColor: 'primary.main',
                  bgcolor: 'action.hover'
                }}
              >
                <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
                  {t('items.lineTotal', 'Line total')} (×{qty})
                </Typography>
                <Typography variant="h5" fontWeight={700} color="primary">
                  {fmtNum(result.lineTotal, currency)}
                </Typography>
                <Chip
                  label={currency}
                  size="small"
                  color="primary"
                  variant="outlined"
                  sx={{ mt: 0.75, fontSize: '0.65rem' }}
                />
              </Paper>
            </Stack>

            {/* All-currency summary */}
            <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
              <Typography
                variant="caption"
                color="text.secondary"
                fontWeight={600}
                sx={{
                  textTransform: 'uppercase',
                  letterSpacing: '0.07em',
                  fontSize: '0.7rem',
                  display: 'block',
                  mb: 1.5
                }}
              >
                {t('items.allCurrencies', 'All currencies — unit price')}
              </Typography>
              <Stack spacing={1}>
                {OUTPUT_CURRENCY_CODES.map(c => {
                  const r = computePrice({
                    randCost,
                    qty,
                    transportFactor,
                    exchangeDivisor,
                    profitMultiplier,
                    usdVatRate,
                    rtgsRate,
                    currency: c
                  });
                  return (
                    <Stack key={c} direction="row" justifyContent="space-between" alignItems="center">
                      <Chip
                        label={c}
                        size="small"
                        variant={c === currency ? 'filled' : 'outlined'}
                        color={c === currency ? 'primary' : 'default'}
                        sx={{ fontSize: '0.7rem', minWidth: 52 }}
                      />
                      <Typography variant="body2" fontWeight={c === currency ? 700 : 400} fontFamily="monospace">
                        {fmtNum(r.unitPrice, c)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" fontFamily="monospace" fontSize="0.75rem">
                        ×{qty} = {fmtNum(r.lineTotal, c)}
                      </Typography>
                    </Stack>
                  );
                })}
              </Stack>
            </Paper>

            {/* Formula breakdown */}
            <Accordion
              disableGutters
              elevation={0}
              sx={{
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: '8px !important',
                '&:before': { display: 'none' }
              }}
            >
              <AccordionSummary expandIcon={<ExpandMoreIcon fontSize="small" />}>
                <Typography
                  variant="caption"
                  fontWeight={600}
                  color="text.secondary"
                  sx={{ textTransform: 'uppercase', letterSpacing: '0.07em', fontSize: '0.7rem' }}
                >
                  {t('items.formulaBreakdown', 'Formula breakdown')}
                </Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ pt: 0, px: 1.5, pb: 1.5 }}>
                <Table size="small">
                  <TableBody>
                    {breakdownRows.map((row, i) => (
                      <TableRow key={i} sx={{ '&:last-child td': { borderBottom: 0 } }}>
                        <TableCell
                          sx={{ pl: 0, py: 0.5, fontSize: '0.72rem', color: 'text.secondary', borderColor: 'divider' }}
                        >
                          <Stack direction="row" alignItems="center" spacing={0.75}>
                            <Box
                              sx={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: 18,
                                height: 18,
                                borderRadius: '50%',
                                bgcolor: 'action.selected',
                                fontSize: '0.6rem',
                                fontWeight: 700,
                                flexShrink: 0
                              }}
                            >
                              {i + 1}
                            </Box>
                            <span>{row.label}</span>
                          </Stack>
                        </TableCell>
                        <TableCell
                          align="right"
                          sx={{
                            pr: 0,
                            py: 0.5,
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            fontFamily: 'monospace',
                            borderColor: 'divider'
                          }}
                        >
                          {row.value}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </AccordionDetails>
            </Accordion>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
};
