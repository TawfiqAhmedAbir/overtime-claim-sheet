import type { MonthSelection } from '../types';
import {
  addMonths,
  formatMonthLabel,
  recentMonthOptions,
} from '../lib/dates';
import { ChevronLeftIcon, ChevronRightIcon } from './Icons';

interface MonthPickerProps {
  value: MonthSelection;
  onChange: (value: MonthSelection) => void;
}

export default function MonthPicker({ value, onChange }: MonthPickerProps) {
  const options = recentMonthOptions(12);
  const oldest = options[options.length - 1];
  const canGoBack =
    value.year > oldest.year ||
    (value.year === oldest.year && value.month > oldest.month);

  function handlePrev() {
    if (!canGoBack) return;
    onChange(addMonths(value, -1));
  }

  function handleNext() {
    onChange(addMonths(value, 1));
  }

  return (
    <div className="month-picker-row">
      <button
        type="button"
        className="month-nav-button"
        onClick={handlePrev}
        disabled={!canGoBack}
        aria-label="Previous month"
      >
        <ChevronLeftIcon size={18} />
      </button>
      <span className="month-picker-label">{formatMonthLabel(value)}</span>
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
