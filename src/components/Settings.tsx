import { useRef, useState } from 'react';
import BreakPicker from './BreakPicker';
import TimeField from './TimeField';
import type { Preferences, Profile, UsualShift, WorkSettings } from '../types';
import { JOB_TITLES, SITES } from '../types';
import {
  formatShiftClaimFromMinutes,
  normalShiftHoursFromText,
  normalShiftOptions,
} from '../lib/hours';
import { exportBackupJson, importBackupJson } from '../lib/storage';

interface SettingsProps {
  profile: Profile;
  usualShift: UsualShift;
  workSettings: WorkSettings;
  preferences: Preferences;
  onSaveProfile: (profile: Profile) => void;
  onSaveUsualShift: (usualShift: UsualShift) => void;
  onSaveWorkSettings: (workSettings: WorkSettings) => void;
  onSavePreferences: (preferences: Preferences) => void;
  onImportComplete: () => void;
  onClose: () => void;
}

const RING_GOAL_OPTIONS = [20, 25, 30, 35, 40, 45, 50, 60];

export default function Settings({
  profile,
  usualShift,
  workSettings,
  preferences,
  onSaveProfile,
  onSaveUsualShift,
  onSaveWorkSettings,
  onSavePreferences,
  onImportComplete,
  onClose,
}: SettingsProps) {
  const [profileDraft, setProfileDraft] = useState(profile);
  const [shiftDraft, setShiftDraft] = useState(usualShift);
  const [workDraft, setWorkDraft] = useState(workSettings);
  const [prefsDraft, setPrefsDraft] = useState(preferences);
  const [importError, setImportError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const normalShiftText = formatShiftClaimFromMinutes(
    Math.round(workDraft.normalShiftHours * 60),
  );
  const normalOptions = normalShiftOptions(8);

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    onSaveProfile(profileDraft);
    onSaveUsualShift(shiftDraft);
    onSaveWorkSettings(workDraft);
    onSavePreferences(prefsDraft);
    onClose();
  }

  function handleExportBackup() {
    const json = exportBackupJson();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'overtime-sheet-backup.json';
    anchor.click();
    URL.revokeObjectURL(url);
  }

  function handleImportFile(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    setImportError('');
    const reader = new FileReader();
    reader.onload = () => {
      const text = typeof reader.result === 'string' ? reader.result : '';
      if (!importBackupJson(text)) {
        setImportError('Could not read that file. Choose a backup from this app.');
        return;
      }
      onImportComplete();
      onClose();
    };
    reader.readAsText(file);
  }

  return (
    <form className="panel form-grid" onSubmit={handleSubmit}>
      <div className="field">
        <label htmlFor="name">Name</label>
        <input
          id="name"
          value={profileDraft.name}
          onChange={(event) =>
            setProfileDraft({ ...profileDraft, name: event.target.value })
          }
        />
      </div>

      <div className="field">
        <label htmlFor="jobTitle">Job title</label>
        <select
          id="jobTitle"
          value={profileDraft.jobTitle}
          onChange={(event) =>
            setProfileDraft({ ...profileDraft, jobTitle: event.target.value })
          }
        >
          {JOB_TITLES.map((title) => (
            <option key={title} value={title}>
              {title}
            </option>
          ))}
        </select>
      </div>

      <div className="field">
        <label htmlFor="site">Site</label>
        <select
          id="site"
          value={profileDraft.site}
          onChange={(event) =>
            setProfileDraft({ ...profileDraft, site: event.target.value })
          }
        >
          {SITES.map((site) => (
            <option key={site} value={site}>
              {site}
            </option>
          ))}
        </select>
      </div>

      <h3 className="settings-section-title">Normal shift length</h3>
      <p className="day-picker-selected">
        Weekday overtime = time on site minus break minus this amount.
      </p>
      <div className="field">
        <label htmlFor="normal-shift">Normal shift</label>
        <select
          id="normal-shift"
          value={normalShiftText}
          onChange={(event) => {
            setWorkDraft({
              ...workDraft,
              normalShiftHours: normalShiftHoursFromText(event.target.value),
            });
          }}
        >
          {normalOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      <div className="field">
        <label htmlFor="ring-goal">Month ring goal</label>
        <select
          id="ring-goal"
          value={workDraft.monthRingGoalHours}
          onChange={(event) =>
            setWorkDraft({
              ...workDraft,
              monthRingGoalHours: Number(event.target.value),
            })
          }
        >
          {RING_GOAL_OPTIONS.map((hours) => (
            <option key={hours} value={hours}>
              {hours} hours
            </option>
          ))}
        </select>
      </div>
      <p className="day-picker-selected">
        The home screen ring fills up to this many hours per month.
      </p>

      <h3 className="settings-section-title">My usual times</h3>
      <p className="day-picker-selected">
        These fill in automatically when you add a new entry.
      </p>

      <TimeField
        id="usual-start"
        label="Usual start"
        value={shiftDraft.start}
        onChange={(start) => setShiftDraft({ ...shiftDraft, start })}
      />

      <TimeField
        id="usual-finish"
        label="Usual finish"
        value={shiftDraft.finish}
        onChange={(finish) => setShiftDraft({ ...shiftDraft, finish })}
      />

      <BreakPicker
        value={shiftDraft.break}
        onChange={(breakOption) => setShiftDraft({ ...shiftDraft, break: breakOption })}
      />

      <h3 className="settings-section-title">Backup</h3>
      <p className="day-picker-selected">
        Save a copy of all your overtime entries when you change phones.
      </p>
      <button type="button" className="secondary-button" onClick={handleExportBackup}>
        Export backup
      </button>
      <button
        type="button"
        className="secondary-button"
        onClick={() => fileInputRef.current?.click()}
      >
        Import backup
      </button>
      <input
        ref={fileInputRef}
        type="file"
        accept="application/json,.json"
        hidden
        onChange={handleImportFile}
      />
      {importError ? <div className="inline-note error">{importError}</div> : null}

      <h3 className="settings-section-title">Display</h3>
      <label className="checkbox-field">
        <input
          type="checkbox"
          checked={prefsDraft.largeText}
          onChange={(event) =>
            setPrefsDraft({ ...prefsDraft, largeText: event.target.checked })
          }
        />
        Large text mode
      </label>

      <div className="form-actions">
        <button type="submit" className="primary-button">
          Save settings
        </button>
        <button type="button" className="secondary-button" onClick={onClose}>
          Close
        </button>
      </div>
    </form>
  );
}
