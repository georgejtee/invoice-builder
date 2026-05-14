const ExcelJS = require('exceljs');
const path = process.argv[2];
if (!path) {
  console.error('usage: node scripts/inspect-xlsx.cjs <path>');
  process.exit(1);
}
(async () => {
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile(path);
  console.log('FILE:', path);
  console.log('SHEETS:', wb.worksheets.map(w => w.name));
  wb.worksheets.forEach(ws => {
    console.log('\n--- sheet:', JSON.stringify(ws.name), 'rowCount:', ws.rowCount, 'colCount:', ws.columnCount, '---');
    const max = Math.min(ws.rowCount, 10);
    for (let r = 1; r <= max; r++) {
      const row = ws.getRow(r);
      const vals = [];
      row.eachCell({ includeEmpty: true }, c => vals.push(c.value));
      console.log('R' + r + ':', JSON.stringify(vals));
    }
  });
})().catch(e => {
  console.error('ERROR reading file:', e.message);
  process.exit(2);
});
