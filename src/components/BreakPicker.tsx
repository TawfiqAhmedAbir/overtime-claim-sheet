import { useState } from 'react';
import type { BreakOption } from '../types';
import {
  BREAK_OPTIONS,
  BREAK_QUICK_OPTIONS,
  breakLabel,
  isQuickBreakOption,
} from '../lib/hours';

interface BreakPickerProps {
  value: BreakOption;
  onChange: (value: BreakOption) => void;
}

const BREAK_OTHER_OPTIONS = BREAK_OPTIONS.filter(
  (option) => !(BREAK_QUICK_OPTIONS as readonly string[]).includes(option),
);

export default function BreakPicker({ value, onChange }: BreakPickerProps) {
  const initialCustom = !isQuickBreakOption(value);
  const [showCustom, setShowCustom] = useState(initialCustom);

  function selectQuick(option: BreakOption) {
    setShowCustom(false);
    onChange(option);
  }

  function selectOther() {
    setShowCustom(true);
    if (isQuickBreakOption(value) && BREAK_OTHER_OPTIONS[0]) {
      onChange(BREAK_OTHER_OPTIONS[0] as BreakOption);
    }
  }

  const quickActive = !showCustom && isQuickBreakOption(value);
  const otherActive = showCustom || !isQuickBreakOption(value);

  return (
    <div className="break-picker">
      <span className="field-label">Break</span>
      <div className="break-picker-chips chip-row">
        {BREAK_QUICK_OPTIONS.map((option) => (
          <button
            key={option || 'none'}
            type="button"
            className={`chip ${quickActive && value === option ? 'active' : ''}`}
            onClick={() => selectQuick(option as BreakOption)}
          >
            {breakLabel(option)}
          </button>
        ))}
        <button
          type="button"
          className={`chip ${otherActive ? 'active' : ''}`}
          onClick={selectOther}
        >
          Other…
        </button>
      </div>

      {showCustom || !isQuickBreakOption(value) ? (
        <div className="field break-picker-custom">
          <label htmlFor="break-other">Other break length</label>
          <select
            id="break-other"
            value={value}
            onChange={(event) => onChange(event.target.value as BreakOption)}
          >
            {BREAK_OTHER_OPTIONS.map((option) => (
              <option key={option || 'none'} value={option}>
                {breakLabel(option)}
              </option>
            ))}
          </select>
        </div>
      ) : null}
    </div>
  );
}
