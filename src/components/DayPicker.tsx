import { useMemo, useState } from 'react';
import type { MonthSelection } from '../types';
import {
  daysInMonth,
  formatEntryDate,
  todayDayInMonth,
  weekdayForDay,
} from '../lib/dates';

interface DayPickerProps {
  selection: MonthSelection;
  value: number;
  onChange: (day: number) => void;
  daysWithEntries?: number[];
}

export default function DayPicker({
  selection,
  value,
  onChange,
  daysWithEntries = [],
}: DayPickerProps) {
  const [expanded, setExpanded] = useState(false);
  const dayCount = daysInMonth(selection);
  const today = todayDayInMonth(selection);
  const entrySet = useMemo(() => new Set(daysWithEntries), [daysWithEntries]);

  const weekDays = useMemo(() => {
    const anchor = today ?? value;
    const start = Math.max(1, anchor - 3);
    const end = Math.min(dayCount, start + 6);
    const adjustedStart = Math.max(1, end - 6);
    const days: number[] = [];
    for (let day = adjustedStart; day <= end; day += 1) {
      days.push(day);
    }
    return days;
  }, [today, value, dayCount]);

  const allDays = useMemo(
    () => Array.from({ length: dayCount }, (_, index) => index + 1),
    [dayCount],
  );

  function renderDayChip(day: number, compact = false) {
    const isSelected = day === value;
    const hasEntry = entrySet.has(day);
    const isToday = day === today;

    return (
      <button
        key={day}
        type="button"
        className={`day-chip ${isSelected ? 'active' : ''} ${compact ? 'compact' : ''}`}
        onClick={() => onChange(day)}
        aria-pressed={isSelected}
        aria-label={formatEntryDate(selection, day)}
      >
        <span className="day-chip-weekday">{weekdayForDay(selection, day)}</span>
        <span className="day-chip-num">{day}</span>
        {hasEntry ? <span className="day-chip-dot" aria-hidden="true" /> : null}
        {isToday ? <span className="day-chip-today">Today</span> : null}
      </button>
    );
  }

  return (
    <div className="day-picker">
      <div className="day-picker-header">
        <span className="field-label">Date</span>
        {today !== undefined ? (
          <button
            type="button"
            className="text-button day-picker-today-btn"
            onClick={() => onChange(today)}
          >
            Jump to today
          </button>
        ) : null}
      </div>

      <div className="day-chip-row">{weekDays.map((day) => renderDayChip(day))}</div>

      <button
        type="button"
        className="text-button day-picker-expand"
        onClick={() => setExpanded((open) => !open)}
        aria-expanded={expanded}
      >
        {expanded ? 'Show fewer dates' : 'More dates this month'}
      </button>

      {expanded ? (
        <div className="day-chip-grid">
          {allDays.map((day) => renderDayChip(day, true))}
        </div>
      ) : null}

      <p className="day-picker-selected">
        Selected: <strong>{formatEntryDate(selection, value)}</strong>
      </p>
    </div>
  );
}
