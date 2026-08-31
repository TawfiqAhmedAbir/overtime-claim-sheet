import type { ChangeEvent } from 'react';
import type { MonthSelection } from '../types';
import {
  addMonths,
  formatMonthLabel,
  fromMonthInputValue,
  toMonthInputValue,
} from '../lib/dates';
import { ChevronLeftIcon, ChevronRightIcon } from './Icons';

interface MonthPickerProps {
  value: MonthSelection;
  onChange: (value: MonthSelection) => void;
}

export default function MonthPicker({ value, onChange }: MonthPickerProps) {
  function handlePrev() {
    onChange(addMonths(value, -1));
  }

  function handleNext() {
    onChange(addMonths(value, 1));
  }

  function handleMonthInput(event: ChangeEvent<HTMLInputElement>) {
    const next = fromMonthInputValue(event.target.value);
    if (next) onChange(next);
  }

  return (
    <div className="month-picker-row">
      <button
        type="button"
        className="month-nav-button"
        onClick={handlePrev}
        aria-label="Previous month"
      >
        <ChevronLeftIcon size={18} />
      </button>
      <label className="month-picker-select">
        <span className="month-picker-label">{formatMonthLabel(value)}</span>
        <input
          type="month"
          className="month-picker-input"
          value={toMonthInputValue(value)}
          onChange={handleMonthInput}
          aria-label="Choose month"
        />
      </label>
      <button
        type="button"
        className="month-nav-button"
        onClick={handleNext}
        aria-label="Next month"
      >
        <ChevronRightIcon size={18} />
      </button>
    </div>
  );
}
