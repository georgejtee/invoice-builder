import { StyleSheet } from '@react-pdf/renderer';

export const nceStyles = StyleSheet.create({
  page: { padding: 30, fontSize: 10, fontFamily: 'Helvetica' },
  header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  companyInfo: { width: '60%' },
  logo: { width: 140, height: 60, marginBottom: 10 },
  refBlock: { width: '35%', textAlign: 'right' },
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
  footer: { marginTop: 30 },
  bankDetails: { marginTop: 20, padding: 10, borderStyle: 'solid', borderWidth: 1, borderColor: '#000' }
});
