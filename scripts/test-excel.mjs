import ExcelJS from 'exceljs';
import JSZip from 'jszip';
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const templatePath = path.join(root, 'public', 'template.xlsx');
const outputPath = path.join(root, 'tmp-golden-test.xlsx');

const goldenEntries = [
  { day: 7, shift: '5 hour ', start: '07:00', finish: '12:00', break: '' },
  {
    day: 10,
    shift: '5 hour 30 min',
    start: '07:00',
    finish: '17:30',
    break: '1 hour',
  },
  {
    day: 12,
    shift: '5 hour 30 min',
    start: '07:00',
    finish: '17:30',
    break: '1 hour',
  },
  {
    day: 14,
    shift: '5 hour',
    start: '07:00',
    finish: '13:00',
    break: '1 hour',
  },
  {
    day: 30,
    shift: '2 hour 30 min',
    start: '07:30',
    finish: '14:00',
    break: '',
  },
  {
    day: 31,
    shift: '2 hour 30 min',
    start: '07:30',
    finish: '14:00',
    break: '',
  },
];

function dayToRow(day) {
  return day + 14;
}

function timeStringToDate(value) {
  const [hours, minutes] = value.split(':').map(Number);
  return new Date(Date.UTC(1899, 11, 30, hours, minutes, 0));
}

function formatTotalHours(total) {
  if (total <= 0) return '0 hours';
  const whole = Math.floor(total + 1e-9);
  const fraction = Math.round((total - whole) * 60);
  if (fraction === 0) return `${whole} hours`;
  if (fraction === 30) return `${whole} hour 30 min`;
  return `${whole} hour ${fraction} min`;
}

function parseShiftHours(shift) {
  const match = shift.trim().match(/^(\d+)\s*hour(?:s)?(?:\s+(\d+)\s*min)?$/i);
  if (!match) return 0;
  return Number(match[1]) + (match[2] ? Number(match[2]) / 60 : 0);
}

function stripFormulaResults(sheet) {
  sheet.eachRow((row) => {
    row.eachCell({ includeEmpty: false }, (cell) => {
      const value = cell.value;
      if (
        value &&
        typeof value === 'object' &&
        ('formula' in value || 'sharedFormula' in value)
      ) {
        const formulaValue = { ...value };
        delete formulaValue.result;
        cell.value = formulaValue;
      }
    });
  });
}

async function main() {
  const buffer = await readFile(templatePath);
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(buffer);
  const sheet = workbook.getWorksheet('Timesheet');

  sheet.getCell('H7').value = new Date(Date.UTC(2026, 7, 1, 12, 0, 0));
  sheet.getCell('H7').numFmt = 'mmm-yy';

  for (let day = 1; day <= 31; day += 1) {
    const row = sheet.getRow(dayToRow(day));
    row.getCell('D').value = null;
    row.getCell('E').value = null;
    row.getCell('F').value = null;
    row.getCell('G').value = null;
  }

  for (const entry of goldenEntries) {
    const row = sheet.getRow(dayToRow(entry.day));
    row.getCell('D').value = entry.shift;
    row.getCell('E').value = timeStringToDate(entry.start);
    row.getCell('F').value = timeStringToDate(entry.finish);
    row.getCell('G').value = entry.break || null;
  }

  const total = goldenEntries.reduce(
    (sum, entry) => sum + parseShiftHours(entry.shift),
    0,
  );
  sheet.getCell('H46').value = formatTotalHours(total);
  stripFormulaResults(sheet);

  const out = await workbook.xlsx.writeBuffer();
  await writeFile(outputPath, Buffer.from(out));

  const zip = await JSZip.loadAsync(out);
  const xml = await zip.file('xl/worksheets/sheet1.xml').async('string');
  const nanCount = (xml.match(/<v>NaN<\/v>/g) || []).length;
  if (nanCount > 0) {
    console.error(`FAIL: found ${nanCount} NaN cached values in output`);
    process.exit(1);
  }

  const checks = [
    ['D21', '5 hour '],
    ['E24', timeStringToDate('07:00')],
    ['G26', '1 hour'],
    ['H46', '26 hours'],
  ];

  for (const [address, expected] of checks) {
    const actual = sheet.getCell(address).value;
    const pass =
      expected instanceof Date
        ? actual instanceof Date &&
          actual.getHours() === expected.getHours() &&
          actual.getMinutes() === expected.getMinutes()
        : String(actual).trim() === String(expected).trim();

    if (!pass) {
      console.error(`FAIL ${address}: expected ${expected}, got ${actual}`);
      process.exit(1);
    }
  }

  console.log('Golden Excel test passed.');
  console.log(`Sample output: ${outputPath}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
