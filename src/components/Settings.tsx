import { useState } from 'react';
import BreakPicker from './BreakPicker';
import WheelPicker from './WheelPicker';
import TimeWheels from './TimeWheels';
import type { Preferences, Profile, UsualShift, WorkSettings } from '../types';
import { JOB_TITLES, SITES } from '../types';
import {
  formatShiftClaimFromMinutes,
  normalShiftOptions,
  parseShiftHours,
} from '../lib/hours';

interface SettingsProps {
  profile: Profile;
  usualShift: UsualShift;
  workSettings: WorkSettings;
  preferences: Preferences;
  onSaveProfile: (profile: Profile) => void;
  onSaveUsualShift: (usualShift: UsualShift) => void;
  onSaveWorkSettings: (workSettings: WorkSettings) => void;
  onSavePreferences: (preferences: Preferences) => void;
  onClose: () => void;
}

export default function Settings({
  profile,
  usualShift,
  workSettings,
  preferences,
  onSaveProfile,
  onSaveUsualShift,
  onSaveWorkSettings,
  onSavePreferences,
  onClose,
}: SettingsProps) {
  const [profileDraft, setProfileDraft] = useState(profile);
  const [shiftDraft, setShiftDraft] = useState(usualShift);
  const [workDraft, setWorkDraft] = useState(workSettings);
  const [prefsDraft, setPrefsDraft] = useState(preferences);

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
      <WheelPicker
        label="Normal shift"
        options={normalOptions}
        value={normalShiftText}
        onChange={(text) => {
          setWorkDraft({ normalShiftHours: parseShiftHours(text) });
        }}
      />

      <h3 className="settings-section-title">My usual times</h3>
      <p className="day-picker-selected">
        These fill in automatically when you add a new entry.
      </p>

      <TimeWheels
        label="Usual start"
        value={shiftDraft.start}
        onChange={(start) => setShiftDraft({ ...shiftDraft, start })}
      />

      <TimeWheels
        label="Usual finish"
        value={shiftDraft.finish}
        onChange={(finish) => setShiftDraft({ ...shiftDraft, finish })}
      />

      <BreakPicker
        value={shiftDraft.break}
        onChange={(breakOption) => setShiftDraft({ ...shiftDraft, break: breakOption })}
      />

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
