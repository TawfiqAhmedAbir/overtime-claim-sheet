import type { MonthSelection } from '../types';
import { isBankHolidayDate } from './bankHolidays';

const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export function monthKey({ year, month }: MonthSelection): string {
  return `${year}-${String(month).padStart(2, '0')}`;
}

export function parseMonthKey(key: string): MonthSelection {
  const [year, month] = key.split('-').map(Number);
  return { year, month };
}

export function currentMonth(): MonthSelection {
  const now = new Date();
  return { year: now.getFullYear(), month: now.getMonth() + 1 };
}

export function formatMonthLabel({ year, month }: MonthSelection): string {
  return `${MONTH_NAMES[month - 1]} ${year}`;
}

export function daysInMonth({ year, month }: MonthSelection): number {
  return new Date(year, month, 0).getDate();
}

export function dayToRow(day: number): number {
  return day + 14;
}

export function rowToDay(row: number): number {
  return row - 14;
}

export function firstOfMonth({ year, month }: MonthSelection): Date {
  return new Date(Date.UTC(year, month - 1, 1, 12, 0, 0));
}

export function weekdayForDay(selection: MonthSelection, day: number): string {
  const date = new Date(selection.year, selection.month - 1, day);
  return date.toLocaleDateString('en-GB', { weekday: 'short' });
}

export function formatEntryDate(selection: MonthSelection, day: number): string {
  const date = new Date(selection.year, selection.month - 1, day);
  return date.toLocaleDateString('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  });
}

export function downloadFileName(selection: MonthSelection): string {
  return `Claim Sheet ${formatMonthLabel(selection)}.xlsx`;
}

export function parseTimeString(value: string): { hours: number; minutes: number } {
  const [hours, minutes] = value.split(':').map(Number);
  return { hours: hours ?? 0, minutes: minutes ?? 0 };
}

export function timeStringToDate(value: string): Date {
  const { hours, minutes } = parseTimeString(value);
  return new Date(Date.UTC(1899, 11, 30, hours, minutes, 0));
}

export function formatTimeLabel(value: string): string {
  const { hours, minutes } = parseTimeString(value);
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
}

export function breakToSheetValue(breakOption: string): string | null {
  if (!breakOption) return null;
  return breakOption;
}

export function breakLabel(breakOption: string): string {
  if (!breakOption) return 'No break';
  return breakOption;
}

export function recentMonthOptions(count = 6): MonthSelection[] {
  const { year, month } = currentMonth();
  const options: MonthSelection[] = [];

  for (let i = 0; i < count; i += 1) {
    const date = new Date(year, month - 1 - i, 1);
    options.push({ year: date.getFullYear(), month: date.getMonth() + 1 });
  }

  return options;
}

export function isCurrentMonth(selection: MonthSelection): boolean {
  const now = currentMonth();
  return selection.year === now.year && selection.month === now.month;
}

export function todayDayInMonth(selection: MonthSelection): number | undefined {
  if (!isCurrentMonth(selection)) return undefined;
  return new Date().getDate();
}

export function defaultDayForMonth(selection: MonthSelection): number {
  return todayDayInMonth(selection) ?? 1;
}

export function addMonths(
  selection: MonthSelection,
  delta: number,
): MonthSelection {
  const date = new Date(selection.year, selection.month - 1 + delta, 1);
  return { year: date.getFullYear(), month: date.getMonth() + 1 };
}

export function toMonthInputValue({ year, month }: MonthSelection): string {
  return `${year}-${String(month).padStart(2, '0')}`;
}

export function fromMonthInputValue(value: string): MonthSelection | null {
  if (!value) return null;
  const [year, month] = value.split('-').map(Number);
  if (!year || !month || month < 1 || month > 12) return null;
  return { year, month };
}

export function dayOfWeekIndex(selection: MonthSelection, day: number): number {
  return new Date(selection.year, selection.month - 1, day).getDay();
}

export function monthKeysEqual(
  a: MonthSelection,
  b: MonthSelection,
): boolean {
  return a.year === b.year && a.month === b.month;
}

export function isWeekend(selection: MonthSelection, day: number): boolean {
  const dow = new Date(selection.year, selection.month - 1, day).getDay();
  return dow === 0 || dow === 6;
}

export function isBankHoliday(selection: MonthSelection, day: number): boolean {
  return isBankHolidayDate(selection.year, selection.month, day);
}

export function isAutoFullOvertimeDay(
  selection: MonthSelection,
  day: number,
): boolean {
  return isWeekend(selection, day) || isBankHoliday(selection, day);
}

export function isFullOvertimeDay(
  selection: MonthSelection,
  day: number,
  manualFullOvertime: boolean,
): boolean {
  return manualFullOvertime || isAutoFullOvertimeDay(selection, day);
}
