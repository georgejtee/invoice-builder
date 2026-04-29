import {
  Grid,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography
} from '@mui/material';
import { useCallback, useEffect, useState, type FC } from 'react';
import { useTranslation } from 'react-i18next';
import { PageHeader } from '../../../shared/components/layout/pageHeader/PageHeader';
import { OUTPUT_CURRENCY_CODES } from '../../../shared/constants/priceCalculatorOptions';
import type { OutputCurrency } from '../../../shared/utils/computePrice';
import { PC_DEFAULTS } from '../../../shared/utils/priceCalculatorFromSettings';
import { useAppDispatch, useAppSelector } from '../../../state/configureStore';
import { selectSettings, setPriceCalculatorParams } from '../../../state/pageSlice';

interface Props {
  showBack: boolean;
  onBack?: () => void;
}

export const PriceCalculatorSettings: FC<Props> = ({ showBack, onBack = () => {} }) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const storeSettings = useAppSelector(selectSettings);

  const [transportFactor, setTransportFactor] = useState(PC_DEFAULTS.pcTransportFactor);
  const [exchangeDivisor, setExchangeDivisor] = useState(PC_DEFAULTS.pcExchangeDivisor);
  const [profitMultiplier, setProfitMultiplier] = useState(PC_DEFAULTS.pcProfitMultiplier);
  const [usdVatRate, setUsdVatRate] = useState(PC_DEFAULTS.pcUsdVatRate);
  const [rtgsRate, setRtgsRate] = useState(PC_DEFAULTS.pcRtgsRate);
  const [defaultCurrency, setDefaultCurrency] = useState<OutputCurrency>('USD');

  useEffect(() => {
    if (!storeSettings) return;
    setTransportFactor(storeSettings.pcTransportFactor ?? PC_DEFAULTS.pcTransportFactor);
    setExchangeDivisor(storeSettings.pcExchangeDivisor ?? PC_DEFAULTS.pcExchangeDivisor);
    setProfitMultiplier(storeSettings.pcProfitMultiplier ?? PC_DEFAULTS.pcProfitMultiplier);
    setUsdVatRate(storeSettings.pcUsdVatRate ?? PC_DEFAULTS.pcUsdVatRate);
    setRtgsRate(storeSettings.pcRtgsRate ?? PC_DEFAULTS.pcRtgsRate);
    const dc = storeSettings.pcDefaultCurrency;
    setDefaultCurrency(dc === 'ZAR' || dc === 'USD' || dc === 'RTGS' ? dc : 'USD');
  }, [storeSettings]);

  const commit = useCallback(
    (
      patch: Partial<{
        pcTransportFactor: number;
        pcExchangeDivisor: number;
        pcProfitMultiplier: number;
        pcUsdVatRate: number;
        pcRtgsRate: number;
        pcDefaultCurrency: string;
      }>
    ) => {
      if (!storeSettings) return;
      dispatch(
        setPriceCalculatorParams({
          pcTransportFactor:
            patch.pcTransportFactor ?? storeSettings.pcTransportFactor ?? PC_DEFAULTS.pcTransportFactor,
          pcExchangeDivisor:
            patch.pcExchangeDivisor ?? storeSettings.pcExchangeDivisor ?? PC_DEFAULTS.pcExchangeDivisor,
          pcProfitMultiplier:
            patch.pcProfitMultiplier ?? storeSettings.pcProfitMultiplier ?? PC_DEFAULTS.pcProfitMultiplier,
          pcUsdVatRate: patch.pcUsdVatRate ?? storeSettings.pcUsdVatRate ?? PC_DEFAULTS.pcUsdVatRate,
          pcRtgsRate: patch.pcRtgsRate ?? storeSettings.pcRtgsRate ?? PC_DEFAULTS.pcRtgsRate,
          pcDefaultCurrency: patch.pcDefaultCurrency ?? storeSettings.pcDefaultCurrency ?? PC_DEFAULTS.pcDefaultCurrency
        })
      );
    },
    [dispatch, storeSettings]
  );

  return (
    <Stack spacing={3}>
      <PageHeader title={t('settingsMenuItems.titles.priceCalculator')} showBack={showBack} onBack={onBack} />
      <Typography variant="body2" color="text.secondary">
        {t('settingsMenuItems.descriptions.priceCalculator')}
      </Typography>

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            size="small"
            fullWidth
            label={t('items.transportFactor')}
            type="number"
            value={transportFactor}
            onChange={e => {
              const v = Math.max(0, Number(e.target.value));
              setTransportFactor(v);
              commit({ pcTransportFactor: v });
            }}
            inputProps={{ min: 0, step: 0.01 }}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            size="small"
            fullWidth
            label={t('items.exchangeDivisor')}
            type="number"
            value={exchangeDivisor}
            onChange={e => {
              const v = Math.max(0.000001, Number(e.target.value));
              setExchangeDivisor(v);
              commit({ pcExchangeDivisor: v });
            }}
            inputProps={{ min: 0.000001, step: 0.01 }}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            size="small"
            fullWidth
            label={t('items.usdVatRate')}
            type="number"
            value={usdVatRate}
            onChange={e => {
              const v = Math.max(0, Number(e.target.value));
              setUsdVatRate(v);
              commit({ pcUsdVatRate: v });
            }}
            inputProps={{ min: 0, step: 0.001 }}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            size="small"
            fullWidth
            label={t('items.profitMultiplier')}
            type="number"
            value={profitMultiplier}
            onChange={e => {
              const v = Math.max(1, Number(e.target.value));
              setProfitMultiplier(v);
              commit({ pcProfitMultiplier: v });
            }}
            inputProps={{ min: 1, step: 0.01 }}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            size="small"
            fullWidth
            label={t('items.rtgsRate')}
            type="number"
            value={rtgsRate}
            onChange={e => {
              const v = Math.max(1, Number(e.target.value));
              setRtgsRate(v);
              commit({ pcRtgsRate: v });
            }}
            inputProps={{ min: 1, step: 0.5 }}
          />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ display: 'block', mb: 1 }}>
            {t('items.outputCurrency')}
          </Typography>
          <ToggleButtonGroup
            value={defaultCurrency}
            exclusive
            size="small"
            onChange={(_e, val) => {
              if (!val) return;
              const v = val as OutputCurrency;
              setDefaultCurrency(v);
              commit({ pcDefaultCurrency: v });
            }}
          >
            {OUTPUT_CURRENCY_CODES.map(c => (
              <ToggleButton key={c} value={c}>
                {c}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        </Grid>
      </Grid>
    </Stack>
  );
};
