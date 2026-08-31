import { useState } from 'react';
import type { Profile } from '../types';
import { JOB_TITLES, SITES } from '../types';

interface SettingsProps {
  profile: Profile;
  onSave: (profile: Profile) => void;
  onClose: () => void;
}

export default function Settings({ profile, onSave, onClose }: SettingsProps) {
  const [draft, setDraft] = useState(profile);

  return (
    <form
      className="panel form-grid"
      onSubmit={(event) => {
        event.preventDefault();
        onSave(draft);
        onClose();
      }}
    >
      <div className="field">
        <label htmlFor="name">Name</label>
        <input
          id="name"
          value={draft.name}
          onChange={(event) =>
            setDraft({ ...draft, name: event.target.value })
          }
        />
      </div>

      <div className="field">
        <label htmlFor="jobTitle">Job title</label>
        <select
          id="jobTitle"
          value={draft.jobTitle}
          onChange={(event) =>
            setDraft({ ...draft, jobTitle: event.target.value })
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
          value={draft.site}
          onChange={(event) => setDraft({ ...draft, site: event.target.value })}
        >
          {SITES.map((site) => (
            <option key={site} value={site}>
              {site}
            </option>
          ))}
        </select>
      </div>

      <div className="form-actions">
        <button type="submit" className="primary-button">
          Save details
        </button>
        <button type="button" className="secondary-button" onClick={onClose}>
          Close
        </button>
      </div>
    </form>
  );
}
