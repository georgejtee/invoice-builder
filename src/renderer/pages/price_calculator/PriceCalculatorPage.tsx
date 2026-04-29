import CalculateIcon from '@mui/icons-material/Calculate';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Chip,
  Divider,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
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
import { computePrice, type OutputCurrency } from '../../shared/utils/computePrice';

const TRANSPORT_OPTIONS = [
  { label: '1.25 — Standard', value: 1.25 },
  { label: '1.35 — Cappuccino / Espresso', value: 1.35 }
];

const EXCHANGE_OPTIONS = [
  { label: '15', value: 15 },
  { label: '17', value: 17 },
  { label: '17.5', value: 17.5 }
];

const VAT_OPTIONS = [
  { label: '14.5%', value: 0.145 },
  { label: '15.0%', value: 0.15 },
  { label: '15.5%', value: 0.155 }
];

const CURRENCIES: OutputCurrency[] = ['USD', 'ZAR', 'RTGS'];

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

  const [currency, setCurrency] = useState<OutputCurrency>('USD');
  const [randCost, setRandCost] = useState<number>(0);
  const [qty, setQty] = useState<number>(1);
  const [transportFactor, setTransportFactor] = useState<number>(1.25);
  const [exchangeDivisor, setExchangeDivisor] = useState<number>(15);
  const [profitMultiplier, setProfitMultiplier] = useState<number>(1.35);
  const [usdVatRate, setUsdVatRate] = useState<number>(0.155);
  const [rtgsRate, setRtgsRate] = useState<number>(36);

  const [result, setResult] = useState(() =>
    computePrice({ randCost: 0, qty: 1, transportFactor: 1.25, exchangeDivisor: 15, profitMultiplier: 1.35, usdVatRate: 0.155, rtgsRate: 36, currency: 'USD' })
  );

  useEffect(() => {
    setResult(
      computePrice({ randCost, qty, transportFactor, exchangeDivisor, profitMultiplier, usdVatRate, rtgsRate, currency })
    );
  }, [randCost, qty, currency, transportFactor, exchangeDivisor, profitMultiplier, usdVatRate, rtgsRate]);

  const breakdownRows = [
    { label: t('items.breakdown.randCost', 'Rand cost (base)'), value: `R ${result.breakdown.randCost.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` },
    { label: t('items.breakdown.randVat', 'ZAR VAT (15%)'), value: `R ${result.breakdown.randVat.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` },
    { label: t('items.breakdown.randTotal', 'ZAR total'), value: `R ${result.breakdown.randTotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` },
    { label: t('items.breakdown.transport', 'Transport (×{{f}})', { f: transportFactor }), value: `R ${result.breakdown.transport.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` },
    { label: t('items.breakdown.usdConversion', 'USD conversion (÷{{d}})', { d: exchangeDivisor }), value: `$ ${result.breakdown.usdConversion.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` },
    { label: t('items.breakdown.usdProfit', 'USD + profit (×{{m}})', { m: profitMultiplier }), value: `$ ${result.breakdown.usdIncProfit.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` },
    { label: t('items.breakdown.usdVat', 'USD VAT ({{r}}%)', { r: (usdVatRate * 100).toFixed(1) }), value: `$ ${result.breakdown.usdVat.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` },
    { label: t('items.breakdown.usdTotal', 'USD unit price'), value: `$ ${result.breakdown.usdTotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` },
    { label: t('items.breakdown.rtgsTotal', 'RTGS total (×{{r}})', { r: rtgsRate }), value: `ZWL ${result.breakdown.rtgsTotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` }
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
            {t('items.priceCalculatorHint', "NCE formula chain: ZAR base cost → VAT → transport → USD conversion → profit → output currency")}
          </Typography>
        </Box>
      </Stack>

      <Grid container spacing={3}>
        {/* ── Left column: inputs ───────────────────────────────────── */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 2 }}>
            <Typography variant="subtitle2" fontWeight={600} gutterBottom sx={{ textTransform: 'uppercase', letterSpacing: '0.07em', fontSize: '0.7rem', color: 'text.secondary' }}>
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
                  <Typography variant="caption" color="text.secondary">{t('common.qty', 'Qty')}</Typography>
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

            <Typography variant="subtitle2" fontWeight={600} gutterBottom sx={{ textTransform: 'uppercase', letterSpacing: '0.07em', fontSize: '0.7rem', color: 'text.secondary' }}>
              {t('items.pricingParams', 'Pricing parameters')}
            </Typography>

            <Stack spacing={1.5} sx={{ mt: 1.5 }}>
              <FormControl size="small" fullWidth>
                <InputLabel>{t('items.transportFactor', 'Transport factor')}</InputLabel>
                <Select
                  value={transportFactor}
                  label={t('items.transportFactor', 'Transport factor')}
                  onChange={e => setTransportFactor(Number(e.target.value))}
                >
                  {TRANSPORT_OPTIONS.map(o => (
                    <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl size="small" fullWidth>
                <InputLabel>{t('items.exchangeDivisor', 'Exchange divisor (ZAR→USD)')}</InputLabel>
                <Select
                  value={exchangeDivisor}
                  label={t('items.exchangeDivisor', 'Exchange divisor (ZAR→USD)')}
                  onChange={e => setExchangeDivisor(Number(e.target.value))}
                >
                  {EXCHANGE_OPTIONS.map(o => (
                    <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl size="small" fullWidth>
                <InputLabel>{t('items.usdVatRate', 'USD VAT rate')}</InputLabel>
                <Select
                  value={usdVatRate}
                  label={t('items.usdVatRate', 'USD VAT rate')}
                  onChange={e => setUsdVatRate(Number(e.target.value))}
                >
                  {VAT_OPTIONS.map(o => (
                    <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>
                  ))}
                </Select>
              </FormControl>

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
              <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ textTransform: 'uppercase', letterSpacing: '0.07em', fontSize: '0.7rem', display: 'block', mb: 1 }}>
                {t('items.outputCurrency', 'Output currency')}
              </Typography>
              <ToggleButtonGroup
                value={currency}
                exclusive
                onChange={(_e, val) => { if (val) setCurrency(val as OutputCurrency); }}
                size="small"
                fullWidth
              >
                {CURRENCIES.map(c => (
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
                sx={{ flex: 1, p: 2, borderRadius: 2, textAlign: 'center', borderColor: 'primary.main', bgcolor: 'action.hover' }}
              >
                <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
                  {t('items.unitPrice', 'Unit price')}
                </Typography>
                <Typography variant="h5" fontWeight={700} color="primary">
                  {fmtNum(result.unitPrice, currency)}
                </Typography>
                <Chip label={currency} size="small" color="primary" variant="outlined" sx={{ mt: 0.75, fontSize: '0.65rem' }} />
              </Paper>

              <Paper
                variant="outlined"
                sx={{ flex: 1, p: 2, borderRadius: 2, textAlign: 'center', borderColor: 'primary.main', bgcolor: 'action.hover' }}
              >
                <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
                  {t('items.lineTotal', 'Line total')} (×{qty})
                </Typography>
                <Typography variant="h5" fontWeight={700} color="primary">
                  {fmtNum(result.lineTotal, currency)}
                </Typography>
                <Chip label={currency} size="small" color="primary" variant="outlined" sx={{ mt: 0.75, fontSize: '0.65rem' }} />
              </Paper>
            </Stack>

            {/* All-currency summary */}
            <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
              <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ textTransform: 'uppercase', letterSpacing: '0.07em', fontSize: '0.7rem', display: 'block', mb: 1.5 }}>
                {t('items.allCurrencies', 'All currencies — unit price')}
              </Typography>
              <Stack spacing={1}>
                {CURRENCIES.map(c => {
                  const r = computePrice({ randCost, qty, transportFactor, exchangeDivisor, profitMultiplier, usdVatRate, rtgsRate, currency: c });
                  return (
                    <Stack key={c} direction="row" justifyContent="space-between" alignItems="center">
                      <Chip label={c} size="small" variant={c === currency ? 'filled' : 'outlined'} color={c === currency ? 'primary' : 'default'} sx={{ fontSize: '0.7rem', minWidth: 52 }} />
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
              sx={{ border: '1px solid', borderColor: 'divider', borderRadius: '8px !important', '&:before': { display: 'none' } }}
            >
              <AccordionSummary expandIcon={<ExpandMoreIcon fontSize="small" />}>
                <Typography variant="caption" fontWeight={600} color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: '0.07em', fontSize: '0.7rem' }}>
                  {t('items.formulaBreakdown', 'Formula breakdown')}
                </Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ pt: 0, px: 1.5, pb: 1.5 }}>
                <Table size="small">
                  <TableBody>
                    {breakdownRows.map((row, i) => (
                      <TableRow key={i} sx={{ '&:last-child td': { borderBottom: 0 } }}>
                        <TableCell sx={{ pl: 0, py: 0.5, fontSize: '0.72rem', color: 'text.secondary', borderColor: 'divider' }}>
                          <Stack direction="row" alignItems="center" spacing={0.75}>
                            <Box
                              sx={{
                                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                                width: 18, height: 18, borderRadius: '50%',
                                bgcolor: 'action.selected', fontSize: '0.6rem', fontWeight: 700, flexShrink: 0
                              }}
                            >
                              {i + 1}
                            </Box>
                            <span>{row.label}</span>
                          </Stack>
                        </TableCell>
                        <TableCell align="right" sx={{ pr: 0, py: 0.5, fontSize: '0.75rem', fontWeight: 600, fontFamily: 'monospace', borderColor: 'divider' }}>
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
