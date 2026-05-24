import { Box, FormControlLabel, Grid, Switch, TextField } from '@mui/material';
import { useEffect, useRef, useState, type FC } from 'react';
import { useTranslation } from 'react-i18next';
import { PageHeader } from '../../../shared/components/layout/pageHeader/PageHeader';
import { validateOnlyNumbersLetters } from '../../../shared/utils/validatorFunctions';
import { useAppSelector } from '../../../state/configureStore';
import { selectSettings } from '../../../state/pageSlice';

interface Props {
  showBack: boolean;
  onBack?: () => void;
  onCustomizedInvoice?: (data: {
    suffix?: string;
    prefix?: string;
    quotePrefix?: string;
    quoteSuffix?: string;
    includeMonth: boolean;
    includeYear: boolean;
    includeBusinessName: boolean;
  }) => void;
}
export const CustomizeInvoice: FC<Props> = ({ showBack, onCustomizedInvoice = () => {}, onBack = () => {} }) => {
  const { t } = useTranslation();
  const storeSettings = useAppSelector(selectSettings);

  const [suffix, setSuffix] = useState<string>(storeSettings?.invoiceSuffix ?? '');
  const [prefix, setPrefix] = useState<string>(storeSettings?.invoicePrefix ?? '');
  const [quotePrefix, setQuotePrefix] = useState<string>(storeSettings?.quotePrefix ?? 'NCE');
  const [quoteSuffix, setQuoteSuffix] = useState<string>(storeSettings?.quoteSuffix ?? 'Q');
  const [includeMonth, setIncludeMonth] = useState<boolean>(storeSettings?.shouldIncludeMonth ?? true);
  const [includeYear, setIncludeYear] = useState<boolean>(storeSettings?.shouldIncludeYear ?? true);
  const [includeBusinessName, setIncludeBusinessName] = useState<boolean>(
    storeSettings?.shouldIncludeBusinessName ?? true
  );
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const emit = (partial: Partial<{ prefix: string; suffix: string; quotePrefix: string; quoteSuffix: string }>) => {
    onCustomizedInvoice({
      prefix: partial.prefix ?? prefix,
      suffix: partial.suffix ?? suffix,
      quotePrefix: partial.quotePrefix ?? quotePrefix,
      quoteSuffix: partial.quoteSuffix ?? quoteSuffix,
      includeMonth,
      includeYear,
      includeBusinessName
    });
  };

  const handleInputChange =
    (setter: (val: string) => void, key: 'prefix' | 'suffix' | 'quotePrefix' | 'quoteSuffix') =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      if (validateOnlyNumbersLetters(value)) {
        setter(value);

        if (debounceRef.current) {
          clearTimeout(debounceRef.current);
        }

        debounceRef.current = setTimeout(() => {
          if (key === 'prefix') emit({ prefix: value });
          else if (key === 'suffix') emit({ suffix: value });
          else if (key === 'quotePrefix') emit({ quotePrefix: value });
          else emit({ quoteSuffix: value });
        }, 500);
      }
    };

  const handleSwitchChange =
    (setter: (val: boolean) => void, key: 'includeMonth' | 'includeYear' | 'includeBusinessName') =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const checked = e.target.checked;
      setter(checked);
      onCustomizedInvoice({
        prefix,
        suffix,
        quotePrefix,
        quoteSuffix,
        includeMonth: key === 'includeMonth' ? checked : includeMonth,
        includeYear: key === 'includeYear' ? checked : includeYear,
        includeBusinessName: key === 'includeBusinessName' ? checked : includeBusinessName
      });
    };

  useEffect(() => {
    const timeout = setTimeout(() => {
      onCustomizedInvoice({ prefix, suffix, quotePrefix, quoteSuffix, includeMonth, includeYear, includeBusinessName });
    }, 500);

    return () => clearTimeout(timeout);
  }, [prefix, suffix, quotePrefix, quoteSuffix, includeMonth, includeYear, includeBusinessName, onCustomizedInvoice]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <PageHeader title={t('settingsMenuItems.titles.customizeInvoice')} showBack={showBack} onBack={onBack} />

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            label={t('common.invoicePrefix')}
            fullWidth
            placeholder="e.g. INV"
            onChange={handleInputChange(setPrefix, 'prefix')}
            value={prefix}
            helperText={t('customizeInvoice.lettersAndNumbers')}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            label={t('common.invoiceSuffix')}
            fullWidth
            placeholder="e.g. ALPHA"
            value={suffix}
            onChange={handleInputChange(setSuffix, 'suffix')}
            helperText={t('customizeInvoice.lettersAndNumbers')}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            label={t('common.quotePrefix')}
            fullWidth
            placeholder="NCE"
            value={quotePrefix}
            onChange={handleInputChange(setQuotePrefix, 'quotePrefix')}
            helperText={t('customizeInvoice.lettersAndNumbers')}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            label={t('common.quoteSuffix')}
            fullWidth
            placeholder="Q"
            value={quoteSuffix}
            onChange={handleInputChange(setQuoteSuffix, 'quoteSuffix')}
            helperText={t('customizeInvoice.lettersAndNumbers')}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 12 }}>
          <FormControlLabel
            control={<Switch checked={includeYear} onChange={handleSwitchChange(setIncludeYear, 'includeYear')} />}
            label={t('customizeInvoice.includeYear')}
          />
          <FormControlLabel
            control={<Switch checked={includeMonth} onChange={handleSwitchChange(setIncludeMonth, 'includeMonth')} />}
            label={t('customizeInvoice.includeMonth')}
          />
          <FormControlLabel
            control={
              <Switch
                checked={includeBusinessName}
                onChange={handleSwitchChange(setIncludeBusinessName, 'includeBusinessName')}
              />
            }
            label={t('customizeInvoice.includeBusinessName')}
          />
        </Grid>
      </Grid>
    </Box>
  );
};
