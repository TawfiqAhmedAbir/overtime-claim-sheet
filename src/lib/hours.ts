const HOUR_PATTERN = /^(\d+)\s*hour(?:s)?(?:\s+(\d+)\s*min)?$/i;

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

  return 0;
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
