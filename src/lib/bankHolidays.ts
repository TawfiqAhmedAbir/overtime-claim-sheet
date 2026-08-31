/** England & Wales bank holidays (YYYY-MM-DD). Extend annually. */
export const UK_BANK_HOLIDAYS = new Set([
  // 2025
  '2025-01-01',
  '2025-04-18',
  '2025-04-21',
  '2025-05-05',
  '2025-05-26',
  '2025-08-25',
  '2025-12-25',
  '2025-12-26',
  // 2026
  '2026-01-01',
  '2026-04-03',
  '2026-04-06',
  '2026-05-04',
  '2026-05-25',
  '2026-08-31',
  '2026-12-25',
  '2026-12-28',
  // 2027
  '2027-01-01',
  '2027-04-02',
  '2027-04-05',
  '2027-05-03',
  '2027-05-31',
  '2027-08-30',
  '2027-12-27',
  '2027-12-28',
]);

export function dateKey(year: number, month: number, day: number): string {
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

export function isBankHolidayDate(
  year: number,
  month: number,
  day: number,
): boolean {
  return UK_BANK_HOLIDAYS.has(dateKey(year, month, day));
}
