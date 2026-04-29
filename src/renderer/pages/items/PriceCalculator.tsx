import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Chip,
  Divider,
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

interface Props {
  /** The base rand cost from the item's amount field */
  randCost: number;
  /** The item's currency symbol (e.g. "$", "R") – used for display hints */
  currencySymbol?: string;
}

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

export const PriceCalculator: FC<Props> = ({ randCost }) => {
  const { t } = useTranslation();
  const storeSettings = useAppSelector(selectSettings);

  const [currency, setCurrency] = useState<OutputCurrency>('USD');
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
      randCost: randCost || 0,
      qty,
      transportFactor,
      exchangeDivisor,
      profitMultiplier,
      usdVatRate,
      rtgsRate,
      currency
    })
  );

  useEffect(() => {
    setResult(
      computePrice({
        randCost: randCost || 0,
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
      label: 'Rand cost (base)',
      value: `R ${result.breakdown.randCost.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    },
    {
      label: 'ZAR VAT (15%)',
      value: `R ${result.breakdown.randVat.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    },
    {
      label: 'ZAR total',
      value: `R ${result.breakdown.randTotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    },
    {
      label: `Transport (×${transportFactor})`,
      value: `R ${result.breakdown.transport.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    },
    {
      label: `USD conversion (÷${exchangeDivisor})`,
      value: `$ ${result.breakdown.usdConversion.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    },
    {
      label: `USD + profit (×${profitMultiplier})`,
      value: `$ ${result.breakdown.usdIncProfit.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    },
    {
      label: `USD VAT (${(usdVatRate * 100).toFixed(1)}%)`,
      value: `$ ${result.breakdown.usdVat.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    },
    {
      label: 'USD unit price',
      value: `$ ${result.breakdown.usdTotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    },
    {
      label: `RTGS total (×${rtgsRate})`,
      value: `ZWL ${result.breakdown.rtgsTotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    }
  ];

  return (
    <Box sx={{ mt: 1 }}>
      <Typography
        variant="subtitle2"
        color="text.secondary"
        gutterBottom
        sx={{ textTransform: 'uppercase', letterSpacing: '0.07em', fontSize: '0.7rem' }}
      >
        {t('items.priceCalculator', 'Price after expense quotation')}
      </Typography>

      {/* Currency selector */}
      <ToggleButtonGroup
        value={currency}
        exclusive
        onChange={(_e, val) => {
          if (val) setCurrency(val as OutputCurrency);
        }}
        size="small"
        fullWidth
        sx={{ mb: 2 }}
      >
        {OUTPUT_CURRENCY_CODES.map(c => (
          <ToggleButton key={c} value={c} sx={{ fontWeight: 600, fontSize: '0.75rem' }}>
            {c}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>

      {/* Result cards */}
      <Stack direction="row" spacing={1.5} sx={{ mb: 2.5 }}>
        <Box
          sx={{
            flex: 1,
            bgcolor: 'action.hover',
            borderRadius: 2,
            p: 1.5,
            textAlign: 'center',
            border: '1px solid',
            borderColor: 'divider'
          }}
        >
          <Typography variant="caption" color="text.secondary" display="block">
            {t('items.unitPrice', 'Unit price')}
          </Typography>
          <Typography variant="h6" fontWeight={700} color="primary">
            {fmtNum(result.unitPrice, currency)}
          </Typography>
          <Chip label={currency} size="small" sx={{ mt: 0.5, fontSize: '0.65rem' }} />
        </Box>

        <Box
          sx={{
            flex: 1,
            bgcolor: 'action.hover',
            borderRadius: 2,
            p: 1.5,
            textAlign: 'center',
            border: '1px solid',
            borderColor: 'divider'
          }}
        >
          <Typography variant="caption" color="text.secondary" display="block">
            {t('items.lineTotal', 'Line total')} (qty: {qty})
          </Typography>
          <Typography variant="h6" fontWeight={700} color="primary">
            {fmtNum(result.lineTotal, currency)}
          </Typography>
          <Chip label={currency} size="small" sx={{ mt: 0.5, fontSize: '0.65rem' }} />
        </Box>
      </Stack>

      {/* Quantity slider */}
      <Box sx={{ mb: 2 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={0.5}>
          <Typography variant="caption" color="text.secondary">
            {t('common.qty', 'Qty')}
          </Typography>
          <TextField
            size="small"
            type="number"
            value={qty}
            onChange={e => {
              const v = Math.max(1, Math.round(Number(e.target.value)));
              setQty(v);
            }}
            inputProps={{ min: 1, style: { textAlign: 'center', width: 60, padding: '4px 8px' } }}
            sx={{ '& fieldset': { borderRadius: 1.5 } }}
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

      <Divider sx={{ my: 1.5 }} />

      {/* Parameters */}
      <Stack spacing={1.5} sx={{ mb: 1.5 }}>
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
          <Tooltip title="USD → RTGS rate (cell Q18)" arrow>
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

      {/* Formula breakdown accordion */}
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
        <AccordionSummary
          expandIcon={<ExpandMoreIcon fontSize="small" />}
          sx={{ minHeight: 40, '& .MuiAccordionSummary-content': { my: 0 } }}
        >
          <Typography variant="caption" fontWeight={600} color="text.secondary">
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
                    <Box component="span" sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.75 }}>
                      <Box
                        component="span"
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
                      {row.label}
                    </Box>
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
    </Box>
  );
};
