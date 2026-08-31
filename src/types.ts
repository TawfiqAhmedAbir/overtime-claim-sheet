export interface Profile {
  name: string;
  jobTitle: string;
  site: string;
}

export type BreakOption =
  | ''
  | '15 min'
  | '30 min'
  | '45 min'
  | '1 hour'
  | '1 hour 30 min';

export interface OvertimeEntry {
  id: string;
  day: number;
  start: string;
  finish: string;
  break: BreakOption;
  shift: string;
  fullOvertimeDay?: boolean;
  shiftOverridden?: boolean;
}

export interface MonthSelection {
  year: number;
  month: number;
}

export interface UsualShift {
  start: string;
  finish: string;
  break: BreakOption;
}

export interface WorkSettings {
  normalShiftHours: number;
}

export interface Preferences {
  largeText: boolean;
  dismissedTips: string[];
  rememberUsualShift: boolean;
}

export const JOB_TITLES = [
  'Adult Phlebotomist',
  'Paediatric Phlebotomist',
  'Phlebotomy Team Leader',
  'Bank Phlebotomist',
] as const;

export const SITES = ['DH', 'GSTT', 'PRUH'] as const;

export const DEFAULT_PROFILE: Profile = {
  name: 'Qaiser Nazneen',
  jobTitle: 'Adult Phlebotomist',
  site: 'DH',
};

export const DEFAULT_USUAL_SHIFT: UsualShift = {
  start: '07:00',
  finish: '17:30',
  break: '1 hour',
};

export const DEFAULT_WORK_SETTINGS: WorkSettings = {
  normalShiftHours: 4,
};

export const DEFAULT_PREFERENCES: Preferences = {
  largeText: false,
  dismissedTips: [],
  rememberUsualShift: true,
};

export type EntryDraft = Omit<OvertimeEntry, 'id'>;
