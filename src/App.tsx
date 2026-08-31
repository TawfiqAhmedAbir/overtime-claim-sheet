import { useEffect, useMemo, useState } from 'react';
import ConfirmSheet from './components/ConfirmSheet';
import DownloadModal from './components/DownloadModal';
import EntryForm from './components/EntryForm';
import EntryList from './components/EntryList';
import MonthPicker from './components/MonthPicker';
import Settings from './components/Settings';
import StatCard from './components/StatCard';
import {
  DownloadIcon,
  PlusIcon,
  RepeatIcon,
  SettingsIcon,
} from './components/Icons';
import { currentMonth, formatEntryDate, formatMonthLabel } from './lib/dates';
import { shareOrDownloadClaimSheet } from './lib/excel';
import { sumShiftHours } from './lib/hours';
import {
  deleteEntry,
  getMostRecentEntry,
  loadEntries,
  loadPreferences,
  loadProfile,
  loadUsualShift,
  loadWorkSettings,
  restoreEntry,
  savePreferences,
  saveProfile,
  saveUsualShift,
  saveWorkSettings,
  upsertEntry,
} from './lib/storage';
import type { EntryDraft, MonthSelection, OvertimeEntry, Profile } from './types';

type Screen = 'home' | 'add' | 'edit' | 'settings';

interface ConfirmState {
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'default' | 'danger';
  alertOnly?: boolean;
  onConfirm: () => void;
}

interface ToastState {
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}

export default function App() {
  const [selection, setSelection] = useState<MonthSelection>(currentMonth());
  const [profile, setProfile] = useState<Profile>(() => loadProfile());
  const [usualShift, setUsualShift] = useState(() => loadUsualShift());
  const [workSettings, setWorkSettings] = useState(() => loadWorkSettings());
  const [preferences, setPreferences] = useState(() => loadPreferences());
  const [entries, setEntries] = useState<OvertimeEntry[]>(() =>
    loadEntries(currentMonth()),
  );
  const [screen, setScreen] = useState<Screen>('home');
  const [editingEntry, setEditingEntry] = useState<OvertimeEntry | undefined>();
  const [addDraft, setAddDraft] = useState<Partial<EntryDraft> | undefined>();
  const [toast, setToast] = useState<ToastState | null>(null);
  const [confirm, setConfirm] = useState<ConfirmState | null>(null);
  const [showDownload, setShowDownload] = useState(false);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    setEntries(loadEntries(selection));
    setScreen('home');
    setEditingEntry(undefined);
    setAddDraft(undefined);
  }, [selection]);

  useEffect(() => {
    document.documentElement.classList.toggle('large-text', preferences.largeText);
  }, [preferences.largeText]);

  useEffect(() => {
    if (!toast) return undefined;
    const timer = window.setTimeout(() => setToast(null), toast.onAction ? 5000 : 2400);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const totalHours = useMemo(
    () => sumShiftHours(entries.map((entry) => entry.shift)),
    [entries],
  );

  function showSavedMessage(entry: OvertimeEntry) {
    setToast({ message: `Saved — ${formatEntryDate(selection, entry.day)}` });
  }

  function handleSaveEntry(entry: OvertimeEntry, updateUsual: boolean) {
    const next = upsertEntry(selection, entry);
    setEntries(next);

    if (updateUsual) {
      const nextUsual = {
        start: entry.start,
        finish: entry.finish,
        break: entry.break,
      };
      saveUsualShift(nextUsual);
      setUsualShift(nextUsual);
    }

    setScreen('home');
    setEditingEntry(undefined);
    setAddDraft(undefined);
    showSavedMessage(entry);
  }

  function requestDelete(entry: OvertimeEntry) {
    setConfirm({
      title: 'Delete overtime?',
      message: `Remove overtime for ${formatEntryDate(selection, entry.day)}?`,
      confirmLabel: 'Delete',
      variant: 'danger',
      onConfirm: () => {
        setConfirm(null);
        const next = deleteEntry(selection, entry.id);
        setEntries(next);
        setToast({
          message: 'Entry deleted',
          actionLabel: 'Undo',
          onAction: () => {
            const restored = restoreEntry(selection, entry);
            setEntries(restored);
            setToast({ message: 'Entry restored' });
          },
        });
      },
    });
  }

  function handleDuplicateDay(day: number, onReplace: () => void) {
    setConfirm({
      title: 'Replace existing entry?',
      message: `You already saved overtime for day ${day}. Replace it with this entry?`,
      confirmLabel: 'Replace',
      onConfirm: () => {
        setConfirm(null);
        onReplace();
      },
    });
  }

  async function handleDownload(mode: 'share' | 'download') {
    try {
      setDownloading(true);
      const result = await shareOrDownloadClaimSheet(
        selection,
        profile,
        entries,
        mode,
      );
      setShowDownload(false);
      setToast({
        message:
          result === 'shared'
            ? 'Ready to share'
            : 'Claim sheet downloaded',
      });
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') {
        return;
      }
      setConfirm({
        title: 'Could not create file',
        message:
          error instanceof Error
            ? error.message
            : 'Could not create the claim sheet.',
        alertOnly: true,
        onConfirm: () => setConfirm(null),
      });
    } finally {
      setDownloading(false);
    }
  }

  function handleSameAsLastTime() {
    const last = getMostRecentEntry(selection);
    if (!last) return;

    const draft: Partial<EntryDraft> = {
      start: last.start,
      finish: last.finish,
      break: last.break,
      day: undefined,
    };

    setAddDraft(draft);
    setScreen('add');
  }

  return (
    <div className="app-shell">
      <header className="top-bar">
        <div className="brand">
          <h1>Overtime Claim</h1>
          <p>{formatMonthLabel(selection)}</p>
          {screen === 'home' ? (
            <p className="profile-snippet">
              {profile.name} · {profile.site}
            </p>
          ) : null}
        </div>
        {screen === 'home' ? (
          <button
            type="button"
            className="icon-button"
            onClick={() => setScreen('settings')}
            aria-label="Settings"
          >
            <SettingsIcon />
          </button>
        ) : (
          <button
            type="button"
            className="text-button"
            onClick={() => {
              setScreen('home');
              setEditingEntry(undefined);
              setAddDraft(undefined);
            }}
          >
            Back
          </button>
        )}
      </header>

      {screen === 'home' ? (
        <>
          <StatCard totalHours={totalHours} entryCount={entries.length} />

          <section className="summary-card">
            <MonthPicker value={selection} onChange={setSelection} />
          </section>

          <div className="section-heading">
            <h2>Your entries</h2>
            <span>{entries.length}</span>
          </div>

          <EntryList
            selection={selection}
            entries={entries}
            onEdit={(entry) => {
              setEditingEntry(entry);
              setScreen('edit');
            }}
            onDelete={requestDelete}
          />
        </>
      ) : null}

      {screen === 'add' ? (
        <EntryForm
          selection={selection}
          initialDraft={addDraft}
          usualShift={usualShift}
          workSettings={workSettings}
          rememberUsualShift={preferences.rememberUsualShift}
          onRememberUsualShiftChange={(value) => {
            const next = { ...preferences, rememberUsualShift: value };
            savePreferences(next);
            setPreferences(next);
          }}
          monthTotalHours={totalHours}
          onSave={handleSaveEntry}
          onCancel={() => {
            setScreen('home');
            setAddDraft(undefined);
          }}
          onDuplicateDay={handleDuplicateDay}
        />
      ) : null}

      {screen === 'edit' && editingEntry ? (
        <EntryForm
          selection={selection}
          entry={editingEntry}
          usualShift={usualShift}
          workSettings={workSettings}
          rememberUsualShift={preferences.rememberUsualShift}
          onRememberUsualShiftChange={(value) => {
            const next = { ...preferences, rememberUsualShift: value };
            savePreferences(next);
            setPreferences(next);
          }}
          monthTotalHours={totalHours}
          onSave={handleSaveEntry}
          onCancel={() => {
            setEditingEntry(undefined);
            setScreen('home');
          }}
          onDuplicateDay={handleDuplicateDay}
        />
      ) : null}

      {screen === 'settings' ? (
        <Settings
          profile={profile}
          usualShift={usualShift}
          workSettings={workSettings}
          preferences={preferences}
          onSaveProfile={(nextProfile) => {
            saveProfile(nextProfile);
            setProfile(nextProfile);
            setToast({ message: 'Settings saved' });
          }}
          onSaveUsualShift={(nextUsual) => {
            saveUsualShift(nextUsual);
            setUsualShift(nextUsual);
          }}
          onSaveWorkSettings={(nextWork) => {
            saveWorkSettings(nextWork);
            setWorkSettings(nextWork);
          }}
          onSavePreferences={(nextPreferences) => {
            savePreferences(nextPreferences);
            setPreferences(nextPreferences);
          }}
          onClose={() => setScreen('home')}
        />
      ) : null}

      {screen === 'home' ? (
        <div className="action-bar">
          <div className="action-bar-inner">
            <button
              type="button"
              className="primary-button"
              onClick={() => {
                setAddDraft(undefined);
                setScreen('add');
              }}
            >
              <PlusIcon size={18} />
              Add overtime
            </button>
            {entries.length > 0 ? (
              <button
                type="button"
                className="accent-button"
                onClick={handleSameAsLastTime}
              >
                <RepeatIcon size={18} />
                Same as last time
              </button>
            ) : null}
            <button
              type="button"
              className="secondary-button"
              disabled={entries.length === 0}
              onClick={() => setShowDownload(true)}
            >
              <DownloadIcon size={18} />
              Download claim sheet
            </button>
          </div>
        </div>
      ) : null}

      {showDownload ? (
        <DownloadModal
          selection={selection}
          entries={entries}
          loading={downloading}
          onConfirm={handleDownload}
          onClose={() => setShowDownload(false)}
        />
      ) : null}

      {confirm ? (
        <ConfirmSheet
          open
          title={confirm.title}
          message={confirm.message}
          confirmLabel={confirm.confirmLabel}
          cancelLabel={confirm.cancelLabel}
          variant={confirm.variant}
          alertOnly={confirm.alertOnly}
          onConfirm={confirm.onConfirm}
          onCancel={() => setConfirm(null)}
        />
      ) : null}

      {toast ? (
        <div className="toast" role="status">
          <span>{toast.message}</span>
          {toast.actionLabel && toast.onAction ? (
            <button
              type="button"
              className="toast-action"
              onClick={() => {
                toast.onAction?.();
              }}
            >
              {toast.actionLabel}
            </button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
