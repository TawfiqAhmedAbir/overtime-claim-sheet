import { useMemo, useState } from 'react';
import type {
  BreakOption,
  MonthSelection,
  OvertimeEntry,
} from '../types';
import { SHIFT_PRESETS } from '../types';
import { daysInMonth, formatEntryDate } from '../lib/dates';
import { findEntryByDay } from '../lib/storage';

interface EntryFormProps {
  selection: MonthSelection;
  entry?: OvertimeEntry;
  onSave: (entry: OvertimeEntry) => void;
  onCancel: () => void;
}

export default function EntryForm({
  selection,
  entry,
  onSave,
  onCancel,
}: EntryFormProps) {
  const dayCount = daysInMonth(selection);
  const [day, setDay] = useState(entry?.day ?? 1);
  const [start, setStart] = useState(entry?.start ?? '07:00');
  const [finish, setFinish] = useState(entry?.finish ?? '17:30');
  const [breakOption, setBreakOption] = useState<BreakOption>(
    entry?.break ?? '1 hour',
  );
  const [shift, setShift] = useState(entry?.shift ?? '5 hour 30 min');
  const [error, setError] = useState('');

  const dayOptions = useMemo(
    () => Array.from({ length: dayCount }, (_, index) => index + 1),
    [dayCount],
  );

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError('');

    if (!shift.trim()) {
      setError('Please enter the overtime hours you are claiming.');
      return;
    }

    if (!start || !finish) {
      setError('Please choose a start and finish time.');
      return;
    }

    const existing = findEntryByDay(selection, day);
    if (existing && existing.id !== entry?.id) {
      const confirmed = window.confirm(
        `You already saved overtime for day ${day}. Replace it with this entry?`,
      );
      if (!confirmed) return;
    }

    onSave({
      id: existing && existing.id !== entry?.id ? existing.id : entry?.id ?? crypto.randomUUID(),
      day,
      start,
      finish,
      break: breakOption,
      shift: shift.trim(),
    });
  }

  return (
    <form className="panel form-grid" onSubmit={handleSubmit}>
      <div className="field">
        <label htmlFor="day">Date</label>
        <select
          id="day"
          value={day}
          onChange={(event) => setDay(Number(event.target.value))}
        >
          {dayOptions.map((option) => (
            <option key={option} value={option}>
              {formatEntryDate(selection, option)}
            </option>
          ))}
        </select>
      </div>

      <div className="field">
        <label htmlFor="start">Start time</label>
        <input
          id="start"
          type="time"
          value={start}
          onChange={(event) => setStart(event.target.value)}
        />
      </div>

      <div className="field">
        <label htmlFor="finish">Finish time</label>
        <input
          id="finish"
          type="time"
          value={finish}
          onChange={(event) => setFinish(event.target.value)}
        />
      </div>

      <div className="field">
        <label>Break</label>
        <div className="chip-row">
          {(['', '30 min', '1 hour'] as BreakOption[]).map((option) => (
            <button
              key={option || 'none'}
              type="button"
              className={`chip ${breakOption === option ? 'active' : ''}`}
              onClick={() => setBreakOption(option)}
            >
              {option || 'No break'}
            </button>
          ))}
        </div>
      </div>

      <div className="field">
        <label htmlFor="shift">Overtime you&apos;re claiming</label>
        <div className="chip-row">
          {SHIFT_PRESETS.map((preset) => (
            <button
              key={preset}
              type="button"
              className={`chip ${shift === preset ? 'active' : ''}`}
              onClick={() => setShift(preset)}
            >
              {preset}
            </button>
          ))}
        </div>
        <input
          id="shift"
          value={shift}
          onChange={(event) => setShift(event.target.value)}
          placeholder="e.g. 5 hour 30 min"
        />
      </div>

      {error ? <div className="inline-note">{error}</div> : null}

      <div className="form-actions">
        <button type="submit" className="primary-button">
          Save overtime
        </button>
        <button type="button" className="secondary-button" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
}
