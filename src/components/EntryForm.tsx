import { useEffect, useMemo, useState } from 'react';
import DayPicker from './DayPicker';
import type {
  BreakOption,
  EntryDraft,
  MonthSelection,
  OvertimeEntry,
  UsualShift,
} from '../types';
import { SHIFT_PRESETS } from '../types';
import { defaultDayForMonth } from '../lib/dates';
import { formatTotalHours, sumShiftHours } from '../lib/hours';
import { findEntryByDay, loadEntries, createEntryId } from '../lib/storage';

interface EntryFormProps {
  selection: MonthSelection;
  entry?: OvertimeEntry;
  initialDraft?: Partial<EntryDraft>;
  usualShift: UsualShift;
  rememberUsualShift: boolean;
  onRememberUsualShiftChange: (value: boolean) => void;
  monthTotalHours: number;
  onSave: (entry: OvertimeEntry, updateUsual: boolean) => void;
  onCancel: () => void;
  onDuplicateDay: (
    day: number,
    onReplace: () => void,
  ) => void;
}

export default function EntryForm({
  selection,
  entry,
  initialDraft,
  usualShift,
  rememberUsualShift,
  onRememberUsualShiftChange,
  monthTotalHours,
  onSave,
  onCancel,
  onDuplicateDay,
}: EntryFormProps) {
  const defaults = entry
    ? {
        day: entry.day,
        start: entry.start,
        finish: entry.finish,
        break: entry.break,
        shift: entry.shift,
      }
    : {
        day: initialDraft?.day ?? defaultDayForMonth(selection),
        start: initialDraft?.start ?? usualShift.start,
        finish: initialDraft?.finish ?? usualShift.finish,
        break: initialDraft?.break ?? usualShift.break,
        shift: initialDraft?.shift ?? usualShift.shift,
      };

  const [day, setDay] = useState(defaults.day);
  const [start, setStart] = useState(defaults.start);
  const [finish, setFinish] = useState(defaults.finish);
  const [breakOption, setBreakOption] = useState<BreakOption>(defaults.break);
  const [shift, setShift] = useState(defaults.shift);
  const [error, setError] = useState('');

  const daysWithEntries = useMemo(() => {
    const currentId = entry?.id;
    return loadEntries(selection)
      .filter((item) => item.id !== currentId)
      .map((item) => item.day);
  }, [selection, entry?.id]);

  const projectedTotal = useMemo(() => {
    const others = loadEntries(selection).filter((item) => item.id !== entry?.id);
    const withoutDay = others.filter((item) => item.day !== day);
    return sumShiftHours([...withoutDay.map((item) => item.shift), shift]);
  }, [selection, entry?.id, day, shift]);

  useEffect(() => {
    if (entry) return;
    setDay(initialDraft?.day ?? defaultDayForMonth(selection));
  }, [selection, entry, initialDraft?.day]);

  function submitEntry() {
    const existing = findEntryByDay(selection, day);
    const payload: OvertimeEntry = {
      id:
        existing && existing.id !== entry?.id
          ? existing.id
          : entry?.id ?? createEntryId(),
      day,
      start,
      finish,
      break: breakOption,
      shift: shift.trim(),
    };

    onSave(payload, rememberUsualShift && !entry);
  }

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
      onDuplicateDay(day, submitEntry);
      return;
    }

    submitEntry();
  }

  return (
    <form className="panel form-grid" onSubmit={handleSubmit}>
      <DayPicker
        selection={selection}
        value={day}
        onChange={setDay}
        daysWithEntries={daysWithEntries}
      />

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

      {!entry ? (
        <label className="checkbox-field">
          <input
            type="checkbox"
            checked={rememberUsualShift}
            onChange={(event) => onRememberUsualShiftChange(event.target.checked)}
          />
          Use these times next time
        </label>
      ) : null}

      <div className="form-footer-total">
        Month total after save: <strong>{formatTotalHours(projectedTotal)}</strong>
        {!entry && monthTotalHours > 0 ? (
          <> (currently {formatTotalHours(monthTotalHours)})</>
        ) : null}
      </div>

      {error ? <div className="inline-note error">{error}</div> : null}

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
