import { useEffect, useMemo, useState } from 'react';
import BreakPicker from './BreakPicker';
import DayPicker from './DayPicker';
import OvertimeField from './OvertimeField';
import TimeStepPicker, { type TimeStep } from './TimeStepPicker';
import type {
  BreakOption,
  EntryDraft,
  MonthSelection,
  OvertimeEntry,
  UsualShift,
  WorkSettings,
} from '../types';
import {
  defaultDayForMonth,
  isAutoFullOvertimeDay,
  isBankHoliday,
  isWeekend,
} from '../lib/dates';
import {
  breakMinutesFromOption,
  calculateOvertime,
  formatTotalHours,
  normalizeBreakOption,
  sumShiftHours,
} from '../lib/hours';
import { findEntryByDay, loadEntries, createEntryId } from '../lib/storage';

interface EntryFormProps {
  selection: MonthSelection;
  entry?: OvertimeEntry;
  initialDraft?: Partial<EntryDraft>;
  usualShift: UsualShift;
  workSettings: WorkSettings;
  rememberUsualShift: boolean;
  onRememberUsualShiftChange: (value: boolean) => void;
  monthTotalHours: number;
  onSave: (entry: OvertimeEntry, updateUsual: boolean) => void;
  onCancel: () => void;
  onDuplicateDay: (day: number, onReplace: () => void) => void;
}

export default function EntryForm({
  selection,
  entry,
  initialDraft,
  usualShift,
  workSettings,
  rememberUsualShift,
  onRememberUsualShiftChange,
  monthTotalHours,
  onSave,
  onCancel,
  onDuplicateDay,
}: EntryFormProps) {
  const initialDay = entry?.day ?? initialDraft?.day ?? defaultDayForMonth(selection);

  const defaults = entry
    ? {
        day: entry.day,
        start: entry.start,
        finish: entry.finish,
        break: entry.break,
      }
    : {
        day: initialDay,
        start: initialDraft?.start ?? usualShift.start,
        finish: initialDraft?.finish ?? usualShift.finish,
        break: initialDraft?.break ?? usualShift.break,
      };

  const [day, setDay] = useState(defaults.day);
  const [start, setStart] = useState(defaults.start);
  const [finish, setFinish] = useState(defaults.finish);
  const [breakOption, setBreakOption] = useState<BreakOption>(
    normalizeBreakOption(defaults.break),
  );
  const [fullOvertime, setFullOvertime] = useState(
    entry?.fullOvertimeDay ??
      initialDraft?.fullOvertimeDay ??
      isAutoFullOvertimeDay(selection, defaults.day),
  );
  const [shiftOverride, setShiftOverride] = useState<string | null>(
    entry?.shiftOverridden ? entry.shift : null,
  );
  const [error, setError] = useState('');
  const [timeStep, setTimeStep] = useState<TimeStep>(entry ? 'finish' : 'start');
  const [startConfirmed, setStartConfirmed] = useState(Boolean(entry));

  const autoFullOvertime = isAutoFullOvertimeDay(selection, day);

  const normalShiftHours = Number.isFinite(workSettings.normalShiftHours)
    ? workSettings.normalShiftHours
    : 4;

  const calculated = useMemo(
    () =>
      calculateOvertime({
        start,
        finish,
        breakMinutes: breakMinutesFromOption(breakOption),
        normalShiftHours,
        fullOvertimeDay: fullOvertime,
      }),
    [start, finish, breakOption, normalShiftHours, fullOvertime],
  );

  const shift = shiftOverride ?? calculated.text;
  const shiftOverridden = shiftOverride !== null;

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

  function handleDayChange(newDay: number) {
    setDay(newDay);
    if (!entry) {
      setFullOvertime(isAutoFullOvertimeDay(selection, newDay));
    }
    setShiftOverride(null);
  }

  function handleStartChange(value: string) {
    setStart(value);
    setShiftOverride(null);
  }

  function handleFinishChange(value: string) {
    setFinish(value);
    setShiftOverride(null);
  }

  function handleBreakChange(value: BreakOption) {
    setBreakOption(value);
    setShiftOverride(null);
  }

  function handleFullOvertimeChange(checked: boolean) {
    setFullOvertime(checked);
    setShiftOverride(null);
  }

  function dayTypeHint(): string | null {
    if (isBankHoliday(selection, day)) return 'Bank holiday — whole shift counts as overtime';
    if (isWeekend(selection, day)) return 'Weekend — whole shift counts as overtime';
    return null;
  }

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
      shift,
      fullOvertimeDay: fullOvertime,
      shiftOverridden,
    };

    onSave(payload, rememberUsualShift && !entry);
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError('');

    if (calculated.minutes <= 0 && !shiftOverridden) {
      setError(
        'No overtime hours calculated. Check your times or turn on “Whole shift is overtime”.',
      );
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

  function handleOvertimeChange(value: string) {
    if (value === calculated.text) {
      setShiftOverride(null);
    } else {
      setShiftOverride(value);
    }
  }

  return (
    <form className="panel form-grid" onSubmit={handleSubmit}>
      <DayPicker
        selection={selection}
        value={day}
        onChange={handleDayChange}
        daysWithEntries={daysWithEntries}
      />

      <TimeStepPicker
        start={start}
        finish={finish}
        step={timeStep}
        startConfirmed={startConfirmed}
        onStepChange={setTimeStep}
        onStartConfirmed={() => setStartConfirmed(true)}
        onStartChange={handleStartChange}
        onFinishChange={handleFinishChange}
      />

      {startConfirmed ? (
        <>
      <BreakPicker value={breakOption} onChange={handleBreakChange} />

      <div className="full-ot-toggle">
        <label className="checkbox-field">
          <input
            type="checkbox"
            checked={fullOvertime}
            onChange={(event) => handleFullOvertimeChange(event.target.checked)}
          />
          Whole shift is overtime (weekend / bank holiday)
        </label>
        {autoFullOvertime ? (
          <p className="day-picker-selected">{dayTypeHint()}</p>
        ) : null}
      </div>

      <OvertimeField
        value={shift}
        calculatedValue={calculated.text}
        overridden={shiftOverridden}
        onSiteMinutes={calculated.onSiteMinutes}
        normalShiftHours={normalShiftHours}
        fullOvertimeDay={fullOvertime}
        onChange={handleOvertimeChange}
      />

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
        </>
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
