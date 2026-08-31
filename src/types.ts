export interface Profile {
  name: string;
  jobTitle: string;
  site: string;
}

export type BreakOption = '' | '30 min' | '1 hour';

export interface OvertimeEntry {
  id: string;
  day: number;
  start: string;
  finish: string;
  break: BreakOption;
  shift: string;
}

export interface MonthSelection {
  year: number;
  month: number;
}

export const JOB_TITLES = [
  'Adult Phlebotomist',
  'Paediatric Phlebotomist',
  'Phlebotomy Team Leader',
  'Bank Phlebotomist',
] as const;

export const SITES = ['DH', 'GSTT', 'PRUH'] as const;

export const SHIFT_PRESETS = [
  '5 hour',
  '5 hour 30 min',
  '2 hour 30 min',
] as const;

export const DEFAULT_PROFILE: Profile = {
  name: 'Qaiser Nazneen',
  jobTitle: 'Adult Phlebotomist',
  site: 'DH',
};
