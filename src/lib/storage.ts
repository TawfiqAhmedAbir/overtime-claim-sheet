import type { MonthSelection, OvertimeEntry, Profile } from '../types';
import { monthKey } from './dates';

const STORAGE_KEY = 'overtime-sheet-v1';

interface StoredData {
  profile: Profile;
  entries: Record<string, OvertimeEntry[]>;
}

function emptyData(profile?: Profile): StoredData {
  return {
    profile: profile ?? {
      name: 'Qaiser Nazneen',
      jobTitle: 'Adult Phlebotomist',
      site: 'DH',
    },
    entries: {},
  };
}

function readStorage(): StoredData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyData();
    const parsed = JSON.parse(raw) as StoredData;
    return {
      profile: parsed.profile ?? emptyData().profile,
      entries: parsed.entries ?? {},
    };
  } catch {
    return emptyData();
  }
}

function writeStorage(data: StoredData): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function loadProfile(): Profile {
  return readStorage().profile;
}

export function saveProfile(profile: Profile): void {
  const data = readStorage();
  data.profile = profile;
  writeStorage(data);
}

export function loadEntries(selection: MonthSelection): OvertimeEntry[] {
  const key = monthKey(selection);
  return readStorage().entries[key] ?? [];
}

export function saveEntries(
  selection: MonthSelection,
  entries: OvertimeEntry[],
): void {
  const data = readStorage();
  data.entries[monthKey(selection)] = entries;
  writeStorage(data);
}

export function upsertEntry(
  selection: MonthSelection,
  entry: OvertimeEntry,
): OvertimeEntry[] {
  const entries = loadEntries(selection);
  const index = entries.findIndex((item) => item.id === entry.id);
  const next = [...entries];

  if (index >= 0) {
    next[index] = entry;
  } else {
    const duplicateDay = next.findIndex((item) => item.day === entry.day);
    if (duplicateDay >= 0) {
      next[duplicateDay] = entry;
    } else {
      next.push(entry);
    }
  }

  next.sort((a, b) => a.day - b.day);
  saveEntries(selection, next);
  return next;
}

export function deleteEntry(
  selection: MonthSelection,
  entryId: string,
): OvertimeEntry[] {
  const next = loadEntries(selection).filter((entry) => entry.id !== entryId);
  saveEntries(selection, next);
  return next;
}

export function findEntryByDay(
  selection: MonthSelection,
  day: number,
): OvertimeEntry | undefined {
  return loadEntries(selection).find((entry) => entry.day === day);
}

export function createEntryId(): string {
  return crypto.randomUUID();
}
