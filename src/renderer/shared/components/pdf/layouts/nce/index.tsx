import { Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer';

/** Vite `public/logo.jpeg` — URL resolved from the document root (dev server or packaged `dist-fe/index.html`). */
const nceLogo = new URL(
  'logo.jpeg',
  new URL('./', typeof window !== 'undefined' ? window.location.href.split('#')[0] : 'http://127.0.0.1:5173/')
).href;

interface NCEItem {
  quantity: string;
  code: string;
  name: string;
  unitPrice: string;
  totalPrice: string;
}

interface NCELayoutData {
  issuedAt?: string;
  refNumber: string;
  clientCompanyName: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  clientAddress: string;
  clientAdditional: string;
  businessName: string;
  businessAddress: string;
  businessEmail: string;
  businessPhone: string;
  businessAdditional: string;
  projectName: string;
  logoUrl?: string;
  items: NCEItem[];
  totalFormatted: string;
}
const styles = StyleSheet.create({
  page: { padding: 30, fontSize: 10, fontFamily: 'Helvetica' },
  /* ── top logo strip ── */
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 6
  },
  companyInfo: { width: '58%', paddingRight: 12 },
  businessName: { fontSize: 14, fontFamily: 'Helvetica-Bold', marginBottom: 3 },
  headerRight: { width: '38%', flexDirection: 'column', alignItems: 'flex-end' },
  logo: { width: 160, height: 90, marginTop: -20, objectFit: 'contain' },
  /* ── client + date/ref row ── */
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginTop: 6,
    marginBottom: 8
  },
  clientBlock: { width: '58%' },
  refBlock: { width: '38%', flexDirection: 'column', alignItems: 'flex-end' },
  refText: { textAlign: 'right' },
  bold: { fontFamily: 'Helvetica-Bold' },
  title: { fontSize: 14, fontFamily: 'Helvetica-Bold', marginBottom: 10 },
  table: {
    width: '100%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    marginTop: 20
  },
  tableRow: { flexDirection: 'row' },
  tableColHeader: {
    borderStyle: 'solid',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    backgroundColor: '#f0f0f0'
  },
  tableCol: { borderStyle: 'solid', borderWidth: 1, borderLeftWidth: 0, borderTopWidth: 0 },
  cell: { margin: 5, fontSize: 9 },
  footer: { marginTop: 15 },
  bankDetails: { marginTop: 15, padding: 10, borderStyle: 'solid', borderWidth: 1, borderColor: '#000' }
});

export const NCELayout = ({ data }: { data: NCELayoutData }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Row 1: business info left · logo right */}
      <View style={styles.header}>
        <View style={styles.companyInfo}>
          {data.businessName ? <Text style={styles.businessName}>{data.businessName}</Text> : null}
          {data.businessAddress ? <Text>{data.businessAddress}</Text> : null}
          {data.businessPhone ? <Text>Mobile: {data.businessPhone}</Text> : null}
          {data.businessEmail ? <Text>Email: {data.businessEmail}</Text> : null}
          {data.businessAdditional ? <Text>{data.businessAdditional}</Text> : null}
        </View>
        <View style={styles.headerRight}>
          <Image style={styles.logo} src={nceLogo} />
        </View>
      </View>

      {/* Row 2: client details left · date + ref right */}
      <View style={styles.metaRow}>
        <View style={styles.clientBlock}>
          {data.clientName ? <Text style={styles.bold}>Attention: {data.clientName}</Text> : null}
          {data.clientCompanyName ? <Text>Company: {data.clientCompanyName}</Text> : null}
          {data.clientAddress ? <Text>Address: {data.clientAddress}</Text> : null}
          {data.clientEmail ? <Text>Email: {data.clientEmail}</Text> : null}
          {data.clientPhone ? <Text>Mobile: {data.clientPhone}</Text> : null}
          {data.clientAdditional ? <Text>{data.clientAdditional}</Text> : null}
        </View>
        <View style={styles.refBlock}>
          <Text style={styles.refText}>
            {data.issuedAt ? new Date(data.issuedAt).toLocaleDateString() : new Date().toLocaleDateString()}
          </Text>
          <Text style={[styles.bold, styles.refText]}>Ref: {data.refNumber}</Text>
        </View>
      </View>
      <Text style={[styles.bold, { marginBottom: 10 }]}>{data.projectName}</Text>

      {/* Items Table */}
      <View style={styles.table}>
        <View style={styles.tableRow}>
          <View style={[styles.tableColHeader, { width: '15%' }]}><Text style={styles.cell}>QUANTITY</Text></View>
          <View style={[styles.tableColHeader, { width: '15%' }]}><Text style={styles.cell}>CODE</Text></View>
          <View style={[styles.tableColHeader, { width: '40%' }]}><Text style={styles.cell}>DESCRIPTION</Text></View>
          <View style={[styles.tableColHeader, { width: '15%' }]}><Text style={styles.cell}>UNIT PRICE</Text></View>
          <View style={[styles.tableColHeader, { width: '15%' }]}><Text style={styles.cell}>TOTAL</Text></View>
        </View>
        {data.items.map((item, i: number) => (
          <View style={styles.tableRow} key={i}>
            <View style={[styles.tableCol, { width: '15%' }]}><Text style={styles.cell}>{item.quantity}</Text></View>
            <View style={[styles.tableCol, { width: '15%' }]}><Text style={styles.cell}>{item.code}</Text></View>
            <View style={[styles.tableCol, { width: '40%' }]}><Text style={styles.cell}>{item.name}</Text></View>
            <View style={[styles.tableCol, { width: '15%' }]}><Text style={styles.cell}>{item.unitPrice}</Text></View>
            <View style={[styles.tableCol, { width: '15%' }]}><Text style={styles.cell}>{item.totalPrice}</Text></View>
          </View>
        ))}
        <View style={styles.tableRow}>
          <View style={[styles.tableCol, { width: '85%' }]}>
            <Text style={[styles.cell, styles.bold, { textAlign: 'right' }]}>TOTAL</Text>
          </View>
          <View style={[styles.tableCol, { width: '15%' }]}>
            <Text style={[styles.cell, styles.bold]}>{data.totalFormatted}</Text>
          </View>
        </View>
      </View>
      <View style={styles.footer}>
        <Text>Delivery Time: 1-2 working weeks from date of payment.</Text>
        <Text>This quote is valid for seven working days.</Text>
      </View>

      <View style={styles.footer}>
        <Text>PRICES BASIS</Text>
        <Text>All goods remain the property of Northern Catering Equipment P/L until paid in full.</Text>
        <Text>Value of goods will be at current price list at the time of invoice and all goods must be fully paid for before delivery/collection. We require 100% payment with order . This quote is valid for seven working days</Text>
      </View>

      {/* Bank Details (From the PDF) */}
      <View style={styles.bankDetails}>
        <Text style={styles.bold}>BANK DETAILS USD ACCOUNT</Text>
        <Text>ACCOUNT NAME: NORTHERN CATERING EQUIPMENT P/L</Text>
        <Text>BANK NAME: CROWN BANK</Text>
        <Text>ACCOUNT NO: 8740409928400</Text>
        <Text>BRANCH :AFRICA UNITY SQUARE</Text>
        <Text>BRANCH CODE : 04000</Text>
        <Text>SWIFT CODE : SCBLZWHXXXX</Text>
      </View>

<View style={styles.footer}>
<Text>We hope the above is in line with your requirements and assure you of our best</Text>
<Text>services and attention at all times .</Text>
</View>

<View style={styles.footer}>
<Text>Yours faithfully</Text>
<Text>Fadzanayi Sadomba</Text>
<Text>Sales & Marketing : 0772 268 623</Text>
</View>



    </Page>
  </Document>
);
