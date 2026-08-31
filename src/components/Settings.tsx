import { useState } from 'react';
import type { BreakOption, Preferences, Profile, UsualShift } from '../types';
import { JOB_TITLES, SHIFT_PRESETS, SITES } from '../types';

interface SettingsProps {
  profile: Profile;
  usualShift: UsualShift;
  preferences: Preferences;
  onSaveProfile: (profile: Profile) => void;
  onSaveUsualShift: (usualShift: UsualShift) => void;
  onSavePreferences: (preferences: Preferences) => void;
  onClose: () => void;
}

export default function Settings({
  profile,
  usualShift,
  preferences,
  onSaveProfile,
  onSaveUsualShift,
  onSavePreferences,
  onClose,
}: SettingsProps) {
  const [profileDraft, setProfileDraft] = useState(profile);
  const [shiftDraft, setShiftDraft] = useState(usualShift);
  const [prefsDraft, setPrefsDraft] = useState(preferences);

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    onSaveProfile(profileDraft);
    onSaveUsualShift(shiftDraft);
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

      <h3 className="settings-section-title">My usual overtime</h3>
      <p className="day-picker-selected">
        These fill in automatically when you add a new entry.
      </p>

      <div className="field">
        <label htmlFor="usualStart">Usual start</label>
        <input
          id="usualStart"
          type="time"
          value={shiftDraft.start}
          onChange={(event) =>
            setShiftDraft({ ...shiftDraft, start: event.target.value })
          }
        />
      </div>

      <div className="field">
        <label htmlFor="usualFinish">Usual finish</label>
        <input
          id="usualFinish"
          type="time"
          value={shiftDraft.finish}
          onChange={(event) =>
            setShiftDraft({ ...shiftDraft, finish: event.target.value })
          }
        />
      </div>

      <div className="field">
        <label>Usual break</label>
        <div className="chip-row">
          {(['', '30 min', '1 hour'] as BreakOption[]).map((option) => (
            <button
              key={option || 'none'}
              type="button"
              className={`chip ${shiftDraft.break === option ? 'active' : ''}`}
              onClick={() => setShiftDraft({ ...shiftDraft, break: option })}
            >
              {option || 'No break'}
            </button>
          ))}
        </div>
      </div>

      <div className="field">
        <label htmlFor="usualShift">Usual hours claimed</label>
        <div className="chip-row">
          {SHIFT_PRESETS.map((preset) => (
            <button
              key={preset}
              type="button"
              className={`chip ${shiftDraft.shift === preset ? 'active' : ''}`}
              onClick={() => setShiftDraft({ ...shiftDraft, shift: preset })}
            >
              {preset}
            </button>
          ))}
        </div>
        <input
          id="usualShift"
          value={shiftDraft.shift}
          onChange={(event) =>
            setShiftDraft({ ...shiftDraft, shift: event.target.value })
          }
        />
      </div>

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
