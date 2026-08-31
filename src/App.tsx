import { useEffect, useMemo, useState } from 'react';
import DownloadModal from './components/DownloadModal';
import EntryForm from './components/EntryForm';
import EntryList from './components/EntryList';
import MonthPicker from './components/MonthPicker';
import Settings from './components/Settings';
import { currentMonth, formatEntryDate, formatMonthLabel } from './lib/dates';
import { downloadClaimSheet } from './lib/excel';
import { formatHoursShort, sumShiftHours } from './lib/hours';
import {
  deleteEntry,
  loadEntries,
  loadProfile,
  saveProfile,
  upsertEntry,
} from './lib/storage';
import type { MonthSelection, OvertimeEntry, Profile } from './types';

type Screen = 'home' | 'add' | 'edit' | 'settings';

export default function App() {
  const [selection, setSelection] = useState<MonthSelection>(currentMonth());
  const [profile, setProfile] = useState<Profile>(() => loadProfile());
  const [entries, setEntries] = useState<OvertimeEntry[]>(() =>
    loadEntries(currentMonth()),
  );
  const [screen, setScreen] = useState<Screen>('home');
  const [editingEntry, setEditingEntry] = useState<OvertimeEntry | undefined>();
  const [toast, setToast] = useState('');
  const [showDownload, setShowDownload] = useState(false);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    setEntries(loadEntries(selection));
    setScreen('home');
    setEditingEntry(undefined);
  }, [selection]);

  useEffect(() => {
    if (!toast) return undefined;
    const timer = window.setTimeout(() => setToast(''), 2400);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const totalHours = useMemo(
    () => sumShiftHours(entries.map((entry) => entry.shift)),
    [entries],
  );

  function showSavedMessage(entry: OvertimeEntry) {
    setToast(`Saved — ${formatEntryDate(selection, entry.day)}`);
  }

  function handleSaveEntry(entry: OvertimeEntry) {
    const next = upsertEntry(selection, entry);
    setEntries(next);
    setScreen('home');
    setEditingEntry(undefined);
    showSavedMessage(entry);
  }

  function handleDeleteEntry(entry: OvertimeEntry) {
    const confirmed = window.confirm(
      `Delete overtime for ${formatEntryDate(selection, entry.day)}?`,
    );
    if (!confirmed) return;
    setEntries(deleteEntry(selection, entry.id));
    setToast('Entry deleted');
  }

  async function handleDownload() {
    try {
      setDownloading(true);
      await downloadClaimSheet(selection, profile, entries);
      setShowDownload(false);
      setToast('Claim sheet downloaded');
    } catch (error) {
      window.alert(
        error instanceof Error
          ? error.message
          : 'Could not create the claim sheet.',
      );
    } finally {
      setDownloading(false);
    }
  }

  return (
    <div className="app-shell">
      <header className="top-bar">
        <div className="brand">
          <h1>Overtime</h1>
          <p>{formatMonthLabel(selection)}</p>
        </div>
        {screen === 'home' ? (
          <button
            type="button"
            className="text-button"
            onClick={() => setScreen('settings')}
          >
            Settings
          </button>
        ) : (
          <button
            type="button"
            className="text-button"
            onClick={() => {
              setScreen('home');
              setEditingEntry(undefined);
            }}
          >
            Back
          </button>
        )}
      </header>

      {screen === 'home' ? (
        <>
          <section className="summary-card">
            <MonthPicker value={selection} onChange={setSelection} />
            <div className="total-line">
              <span>Total this month</span>
              <strong>{formatHoursShort(totalHours)}</strong>
            </div>
          </section>

          <div className="section-heading">
            <h2>Saved overtime</h2>
            <span>{entries.length} entries</span>
          </div>

          <EntryList
            selection={selection}
            entries={entries}
            onEdit={(entry) => {
              setEditingEntry(entry);
              setScreen('edit');
            }}
            onDelete={handleDeleteEntry}
          />
        </>
      ) : null}

      {screen === 'add' ? (
        <EntryForm
          selection={selection}
          onSave={handleSaveEntry}
          onCancel={() => setScreen('home')}
        />
      ) : null}

      {screen === 'edit' && editingEntry ? (
        <EntryForm
          selection={selection}
          entry={editingEntry}
          onSave={handleSaveEntry}
          onCancel={() => {
            setEditingEntry(undefined);
            setScreen('home');
          }}
        />
      ) : null}

      {screen === 'settings' ? (
        <Settings
          profile={profile}
          onSave={(nextProfile) => {
            saveProfile(nextProfile);
            setProfile(nextProfile);
            setToast('Details saved');
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
              onClick={() => setScreen('add')}
            >
              + Add overtime
            </button>
            <button
              type="button"
              className="secondary-button"
              onClick={() => setShowDownload(true)}
            >
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

      {toast ? <div className="toast">{toast}</div> : null}
    </div>
  );
}
