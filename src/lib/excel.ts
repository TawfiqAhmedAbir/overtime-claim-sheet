import ExcelJS from 'exceljs';
import type { MonthSelection, OvertimeEntry, Profile } from '../types';
import {
  breakToSheetValue,
  dayToRow,
  daysInMonth,
  downloadFileName,
  firstOfMonth,
  timeStringToDate,
} from './dates';
import { formatTotalHours, sumShiftHours } from './hours';

const TEMPLATE_URL = `${import.meta.env.BASE_URL}template.xlsx`;

async function loadTemplate(): Promise<ArrayBuffer> {
  const response = await fetch(TEMPLATE_URL);
  if (!response.ok) {
    throw new Error('Could not load the claim sheet template.');
  }
  return response.arrayBuffer();
}

function clearOvertimeRows(sheet: ExcelJS.Worksheet, dayCount: number): void {
  for (let day = 1; day <= 31; day += 1) {
    const row = sheet.getRow(dayToRow(day));
    row.getCell('D').value = null;
    row.getCell('E').value = null;
    row.getCell('F').value = null;
    row.getCell('G').value = null;
  }

  void dayCount;
}

function applyProfile(sheet: ExcelJS.Worksheet, profile: Profile): void {
  sheet.getCell('C6').value = profile.name;
  sheet.getCell('G6').value = profile.jobTitle;
  sheet.getCell('F7').value = profile.site;
  sheet.getCell('B49').value = `Signed (claimant)        ${profile.name}`;
}

function applyMonthAnchor(sheet: ExcelJS.Worksheet, selection: MonthSelection): void {
  const anchor = firstOfMonth(selection);
  const cell = sheet.getCell('H7');
  cell.value = anchor;
  cell.numFmt = 'mmm-yy';
}

function applyEntries(
  sheet: ExcelJS.Worksheet,
  entries: OvertimeEntry[],
): void {
  for (const entry of entries) {
    const row = sheet.getRow(dayToRow(entry.day));
    row.getCell('D').value = entry.shift;
    row.getCell('E').value = timeStringToDate(entry.start);
    row.getCell('F').value = timeStringToDate(entry.finish);

    const breakValue = breakToSheetValue(entry.break);
    row.getCell('G').value = breakValue;
  }
}

function applyTotal(sheet: ExcelJS.Worksheet, entries: OvertimeEntry[]): void {
  const total = sumShiftHours(entries.map((entry) => entry.shift));
  sheet.getCell('H46').value = formatTotalHours(total);
}

function stripFormulaResults(sheet: ExcelJS.Worksheet): void {
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

export async function generateClaimSheet(
  selection: MonthSelection,
  profile: Profile,
  entries: OvertimeEntry[],
): Promise<Blob> {
  const buffer = await loadTemplate();
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(buffer);

  const sheet = workbook.getWorksheet('Timesheet');
  if (!sheet) {
    throw new Error('Timesheet worksheet not found in template.');
  }

  applyProfile(sheet, profile);
  applyMonthAnchor(sheet, selection);
  clearOvertimeRows(sheet, daysInMonth(selection));
  applyEntries(sheet, entries);
  applyTotal(sheet, entries);
  stripFormulaResults(sheet);

  const output = await workbook.xlsx.writeBuffer();
  return new Blob([output], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
}

export async function downloadClaimSheet(
  selection: MonthSelection,
  profile: Profile,
  entries: OvertimeEntry[],
): Promise<void> {
  const blob = await generateClaimSheet(selection, profile, entries);
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = downloadFileName(selection);
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

export { downloadFileName, loadTemplate };
