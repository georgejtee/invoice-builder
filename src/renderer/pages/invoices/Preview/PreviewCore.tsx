import { PDFViewer } from '@react-pdf/renderer';
import { memo, useEffect, useMemo, useRef, useState, type FC } from 'react';
import {
  getAttachmentsUrl,
  getLogoUrl,
  getQRCodeUrls,
  getSignatureUrls,
  getWatermarkPaidUrl,
  getWatermarkUrl
} from '../../../shared/hooks/fileExport/useExportPdf';
import { usePdfTexts } from '../../../shared/hooks/pdf/usePdfTexts';
import { InvoiceType } from '../../../shared/enums/invoiceType';
import type { AttachmentURL, InvoiceFromData } from '../../../shared/types/invoice';
import { useAppDispatch, useAppSelector } from '../../../state/configureStore';
import { addToast, selectSettings } from '../../../state/pageSlice';
import { PDFDocument } from './PDFDocument';

interface Props {
  invoiceForm?: InvoiceFromData;
}
const PreviewCoreComponent: FC<Props> = ({ invoiceForm }) => {
  const dispatch = useAppDispatch();
  const storeSettings = useAppSelector(selectSettings);
  const lastInvalidLogoWarningKeyRef = useRef<string | undefined>(undefined);
  const [logoUrl, setLogoUrl] = useState<string | undefined>();
  const [watermarkUrl, setWatermarkUrl] = useState<string | undefined>();
  const [watermarkPaidUrl, setWatermarkPaidUrl] = useState<string | undefined>();
  const [attachmentUrls, setAttachmentUrls] = useState<AttachmentURL[]>([]);
  const [signatureUrl, setSignatureUrl] = useState<string | undefined>();
  const [qrCodeUrl, setQrCodeUrl] = useState<string | undefined>();
  const [loading, setLoading] = useState(true);
  const pdfTextsDefaults = usePdfTexts({
    labelUpperCase: invoiceForm?.invoiceCustomization?.labelUpperCase,
    language: invoiceForm?.language
  });
  const pdfTexts = useMemo(() => {
    const customLabels = invoiceForm?.invoiceCustomization?.pdfTexts || {};

    return {
      ...pdfTextsDefaults,
      ...customLabels
    };
  }, [invoiceForm, pdfTextsDefaults]);
  const viewerKey = useMemo(() => {
    return [
      invoiceForm?.id ?? 'new',
      invoiceForm?.invoiceType ?? '',
      invoiceForm?.businessId ?? '',
      invoiceForm?.clientId ?? '',
      invoiceForm?.currencyId ?? '',
      invoiceForm?.updatedAt ?? '',
      invoiceForm?.invoiceItems?.length ?? 0,
      invoiceForm?.invoiceAttachments?.length ?? 0
    ].join(':');
  }, [invoiceForm]);

  useEffect(() => {
    let cancelled = false;
    setAttachmentUrls([]);
    setLogoUrl(undefined);
    setWatermarkUrl(undefined);
    setWatermarkPaidUrl(undefined);
    setSignatureUrl(undefined);
    setQrCodeUrl(undefined);
    setLoading(true);

    const loadData = async () => {
      const [logo, watermark, watermarkPaid, attachments, signature, qrCode] = await Promise.allSettled([
        getLogoUrl(invoiceForm),
        getWatermarkUrl(invoiceForm),
        getWatermarkPaidUrl(invoiceForm),
        getAttachmentsUrl(invoiceForm),
        getSignatureUrls(invoiceForm),
        getQRCodeUrls(invoiceForm)
      ]);

      if (cancelled) return;

      setLogoUrl(logo.status === 'fulfilled' ? logo.value : undefined);
      setWatermarkUrl(watermark.status === 'fulfilled' ? watermark.value : undefined);
      setWatermarkPaidUrl(watermarkPaid.status === 'fulfilled' ? watermarkPaid.value : undefined);
      setAttachmentUrls(attachments.status === 'fulfilled' ? attachments.value : []);
      setSignatureUrl(signature.status === 'fulfilled' ? signature.value : undefined);
      setQrCodeUrl(qrCode.status === 'fulfilled' ? qrCode.value : undefined);

      const hasBusinessLogo = invoiceForm?.invoiceBusinessSnapshot?.businessLogo !== undefined;
      const rawLogoDataUrl = logo.status === 'fulfilled' ? logo.value : undefined;
      const logoIsSafe = typeof rawLogoDataUrl === 'string' && /^data:image\/[a-z0-9.+\-]+;base64,/i.test(rawLogoDataUrl);
      const shouldWarnForUnsupportedLogo =
        invoiceForm?.invoiceType === InvoiceType.quotation && hasBusinessLogo && (!rawLogoDataUrl || !logoIsSafe);

      if (shouldWarnForUnsupportedLogo) {
        const warningKey = `${invoiceForm?.businessId ?? 'none'}:${invoiceForm?.invoiceBusinessSnapshot?.businessFileType ?? 'unknown'}`;
        if (lastInvalidLogoWarningKeyRef.current !== warningKey) {
          lastInvalidLogoWarningKeyRef.current = warningKey;
          dispatch(
            addToast({
              message: 'Business logo is not supported in quote preview. Please use PNG or JPEG.',
              severity: 'warning'
            })
          );
        }
      }

      setLoading(false);
    };

    loadData();

    return () => {
      cancelled = true;
    };
  }, [dispatch, invoiceForm]);

  if (loading) return null;

  return (
    <PDFViewer
      key={viewerKey}
      style={{ width: '100%', height: '100%', border: 'none' }}
      showToolbar={false}
    >
      <PDFDocument
        invoiceForm={invoiceForm}
        storeSettings={storeSettings}
        logoUrl={logoUrl}
        qrCodeUrl={qrCodeUrl}
        attachmentUrls={attachmentUrls}
        pdfTexts={pdfTexts}
        watermarkUrl={watermarkUrl}
        watermarkPaidUrl={watermarkPaidUrl}
        signatureUrl={signatureUrl}
      />
    </PDFViewer>
  );
};
export const PreviewCore = memo(PreviewCoreComponent);
