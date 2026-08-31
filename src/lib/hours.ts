const HOUR_PATTERN = /^(\d+)\s*hour(?:s)?(?:\s+(\d+)\s*min)?$/i;

export const BREAK_OPTIONS = buildBreakOptions();

export type BreakOption = (typeof BREAK_OPTIONS)[number];

function buildBreakOptions(): string[] {
  const options: string[] = [''];
  for (let minutes = 15; minutes <= 120; minutes += 15) {
    options.push(formatBreakOption(minutes));
  }
  return options;
}

export function formatBreakOption(minutes: number): string {
  if (minutes === 0) return '';
  if (minutes === 60) return '1 hour';
  if (minutes === 90) return '1 hour 30 min';
  if (minutes === 120) return '2 hour';
  return `${minutes} min`;
}

export function breakMinutesFromOption(breakOption: string): number {
  if (!breakOption) return 0;
  if (breakOption === '1 hour') return 60;
  if (breakOption === '1 hour 30 min') return 90;
  if (breakOption === '2 hour') return 120;
  const match = breakOption.match(/^(\d+)\s*min$/);
  if (match) return Number(match[1]);
  return 0;
}

export function breakLabel(breakOption: string): string {
  if (!breakOption) return 'No break';
  return breakOption;
}

export function normalizeBreakOption(value: string): BreakOption {
  const minutes = breakMinutesFromOption(value);
  const normalized = formatBreakOption(minutes) as BreakOption;
  if (BREAK_OPTIONS.includes(normalized)) return normalized;
  return '';
}

export function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(':').map(Number);
  return (hours ?? 0) * 60 + (minutes ?? 0);
}

export function minutesToTime(totalMinutes: number): string {
  const hours = Math.floor(totalMinutes / 60) % 24;
  const minutes = totalMinutes % 60;
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
}

export function sessionMinutes(
  start: string,
  finish: string,
  breakMinutes: number,
): number {
  const startM = timeToMinutes(start);
  const finishM = timeToMinutes(finish);
  let duration = finishM - startM;
  if (duration < 0) duration += 24 * 60;
  return Math.max(0, duration - breakMinutes);
}

export function formatShiftClaimFromMinutes(totalMinutes: number): string {
  const rounded = Math.max(0, Math.round(totalMinutes));
  const hours = Math.floor(rounded / 60);
  const minutes = rounded % 60;

  if (hours === 0 && minutes === 0) return '0 hour';
  if (minutes === 0) {
    return hours === 1 ? '1 hour' : `${hours} hour`;
  }
  if (minutes === 30) {
    return hours === 0 ? '30 min' : `${hours} hour 30 min`;
  }
  if (hours === 0) return `${minutes} min`;
  return `${hours} hour ${minutes} min`;
}

export function formatShiftClaim(hours: number, minutes: 0 | 30 = 0): string {
  return formatShiftClaimFromMinutes(hours * 60 + minutes);
}

export function allOvertimeOptions(maxHours = 12): string[] {
  const options: string[] = [];
  for (let mins = 0; mins <= maxHours * 60; mins += 30) {
    options.push(formatShiftClaimFromMinutes(mins));
  }
  return options;
}

export interface CalculateOvertimeInput {
  start: string;
  finish: string;
  breakMinutes: number;
  normalShiftHours: number;
  fullOvertimeDay: boolean;
}

export interface CalculateOvertimeResult {
  minutes: number;
  text: string;
  onSiteMinutes: number;
}

export function calculateOvertime(
  input: CalculateOvertimeInput,
): CalculateOvertimeResult {
  const onSiteMinutes = sessionMinutes(
    input.start,
    input.finish,
    input.breakMinutes,
  );
  const normalHours = Number.isFinite(input.normalShiftHours)
    ? input.normalShiftHours
    : 4;
  const normalMinutes = input.fullOvertimeDay
    ? 0
    : Math.round(normalHours * 60);
  const overtimeMinutes = Math.max(0, onSiteMinutes - normalMinutes);

  return {
    minutes: overtimeMinutes,
    text: formatShiftClaimFromMinutes(overtimeMinutes),
    onSiteMinutes,
  };
}

export function parseShiftHours(shift: string): number {
  const trimmed = shift.trim();
  if (!trimmed) return 0;

  const match = trimmed.match(HOUR_PATTERN);
  if (match) {
    const hours = Number(match[1]);
    const minutes = match[2] ? Number(match[2]) : 0;
    return hours + minutes / 60;
  }

  const simple = trimmed.match(/^(\d+(?:\.\d+)?)\s*h(?:r|our)?s?$/i);
  if (simple) return Number(simple[1]);

  const minsOnly = trimmed.match(/^(\d+)\s*min$/i);
  if (minsOnly) return Number(minsOnly[1]) / 60;

  return 0;
}

export function shiftTextToMinutes(text: string): number {
  return Math.round(parseShiftHours(text) * 60);
}

export function formatTotalHours(total: number): string {
  if (total <= 0) return '0 hours';

  const whole = Math.floor(total + 1e-9);
  const fraction = Math.round((total - whole) * 60);

  if (fraction === 0) {
    return whole === 1 ? '1 hour' : `${whole} hours`;
  }

  if (fraction === 30) {
    return `${whole} hour 30 min`;
  }

  const mins = Math.round(total * 60);
  const hoursPart = Math.floor(mins / 60);
  const minsPart = mins % 60;
  if (minsPart === 0) {
    return hoursPart === 1 ? '1 hour' : `${hoursPart} hours`;
  }
  return `${hoursPart} hour ${minsPart} min`;
}

export function formatHoursShort(total: number): string {
  if (total <= 0) return '0 hr';

  const whole = Math.floor(total + 1e-9);
  const fraction = Math.round((total - whole) * 60);

  if (fraction === 0) return `${whole} hr`;
  if (fraction === 30) return `${whole} hr 30`;
  return formatTotalHours(total);
}

export function sumShiftHours(shifts: string[]): number {
  return shifts.reduce((sum, shift) => sum + parseShiftHours(shift), 0);
}

export function normalShiftOptions(maxHours = 8): string[] {
  const options: string[] = [];
  for (let mins = 30; mins <= maxHours * 60; mins += 30) {
    options.push(formatShiftClaimFromMinutes(mins));
  }
  return options;
}

export function normalShiftHoursFromText(text: string): number {
  return parseShiftHours(text);
}

export const TIME_HOUR_OPTIONS = Array.from({ length: 24 }, (_, hour) =>
  String(hour).padStart(2, '0'),
);

export const TIME_MINUTE_OPTIONS = ['00', '15', '30', '45'];
