import { useState } from 'react';
import BreakPicker from './BreakPicker';
import TimeField from './TimeField';
import {
  formatShiftClaimFromMinutes,
  normalShiftHoursFromText,
  normalShiftOptions,
} from '../lib/hours';
import type { BreakOption, UsualShift } from '../types';
import { JOB_TITLES, SITES, DEFAULT_WORK_SETTINGS } from '../types';

interface SetupScreenProps {
  showInstall: boolean;
  onInstall: () => void;
  onComplete: (
    profile: {
      name: string;
      jobTitle: string;
      site: string;
    },
    normalShiftHours: number,
    usualShift: UsualShift,
  ) => void;
}

export default function SetupScreen({
  showInstall,
  onInstall,
  onComplete,
}: SetupScreenProps) {
  const [name, setName] = useState('');
  const [jobTitle, setJobTitle] = useState<string>(JOB_TITLES[0]);
  const [site, setSite] = useState<string>(SITES[0]);
  const [normalShiftHours, setNormalShiftHours] = useState(
    DEFAULT_WORK_SETTINGS.normalShiftHours,
  );
  const [start, setStart] = useState('');
  const [finish, setFinish] = useState('');
  const [breakOption, setBreakOption] = useState<BreakOption | null>(null);
  const normalShiftText = formatShiftClaimFromMinutes(Math.round(normalShiftHours * 60));
  const normalOptions = normalShiftOptions(8);
  const canSave =
    name.trim().length > 0 &&
    start !== '' &&
    finish !== '' &&
    breakOption !== null;

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!canSave) return;
    if (breakOption === null) return;
    onComplete(
      { name: name.trim(), jobTitle, site },
      normalShiftHours,
      { start, finish, break: breakOption },
    );
  }

  return (
    <div className="app-shell app-shell--form">
      <header className="top-bar">
        <div className="brand">
          <h1>Overtime Claim</h1>
          <p>Your details</p>
        </div>
      </header>

      <form className="panel form-grid" onSubmit={handleSubmit}>
        <p className="day-picker-selected">This stays on this phone.</p>

        <div className="field">
          <label htmlFor="setup-name">Name</label>
          <input
            id="setup-name"
            value={name}
            autoComplete="name"
            autoFocus
            onChange={(event) => setName(event.target.value)}
          />
        </div>

        <div className="field">
          <label htmlFor="setup-job">Job title</label>
          <select
            id="setup-job"
            value={jobTitle}
            onChange={(event) => setJobTitle(event.target.value)}
          >
            {JOB_TITLES.map((title) => (
              <option key={title} value={title}>
                {title}
              </option>
            ))}
          </select>
        </div>

        <div className="field">
          <label htmlFor="setup-site">Site</label>
          <select
            id="setup-site"
            value={site}
            onChange={(event) => setSite(event.target.value)}
          >
            {SITES.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <div className="field">
          <label htmlFor="setup-shift">Normal shift</label>
          <select
            id="setup-shift"
            value={normalShiftText}
            onChange={(event) =>
              setNormalShiftHours(normalShiftHoursFromText(event.target.value))
            }
          >
            {normalOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <TimeField
          id="setup-start"
          label="Start time"
          value={start}
          onChange={setStart}
        />

        <TimeField
          id="setup-finish"
          label="Finish time"
          value={finish}
          onChange={setFinish}
        />

        <BreakPicker value={breakOption} onChange={setBreakOption} />

        <div className="form-actions">
          <button type="submit" className="primary-button" disabled={!canSave}>
            Save
          </button>
          {showInstall ? (
            <button type="button" className="secondary-button" onClick={onInstall}>
              Add to home screen
            </button>
          ) : null}
        </div>
      </form>
    </div>
  );
}
