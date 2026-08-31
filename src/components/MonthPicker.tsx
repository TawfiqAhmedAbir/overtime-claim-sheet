import type { MonthSelection } from '../types';
import { formatMonthLabel, recentMonthOptions } from '../lib/dates';

interface MonthPickerProps {
  value: MonthSelection;
  onChange: (value: MonthSelection) => void;
}

export default function MonthPicker({ value, onChange }: MonthPickerProps) {
  const options = recentMonthOptions(12);
  const selectedKey = `${value.year}-${value.month}`;

  return (
    <label className="field">
      <span>Month</span>
      <select
        className="month-select"
        value={selectedKey}
        onChange={(event) => {
          const [year, month] = event.target.value.split('-').map(Number);
          onChange({ year, month });
        }}
      >
        {options.map((option) => {
          const key = `${option.year}-${option.month}`;
          return (
            <option key={key} value={key}>
              {formatMonthLabel(option)}
            </option>
          );
        })}
      </select>
    </label>
  );
}
