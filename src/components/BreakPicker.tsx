import { useState } from 'react';
import DurationInput from './DurationInput';
import type { BreakOption } from '../types';
import {
  BREAK_QUICK_OPTIONS,
  breakLabel,
  isQuickBreakOption,
} from '../lib/hours';

interface BreakPickerProps {
  value: BreakOption;
  onChange: (value: BreakOption) => void;
}

export default function BreakPicker({ value, onChange }: BreakPickerProps) {
  const initialCustom = !isQuickBreakOption(value);
  const [showCustom, setShowCustom] = useState(initialCustom);

  function selectQuick(option: BreakOption) {
    setShowCustom(false);
    onChange(option);
  }

  function selectOther() {
    setShowCustom(true);
    if (isQuickBreakOption(value)) {
      onChange('15 min' as BreakOption);
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
        <div className="break-picker-custom">
          <DurationInput value={value} onChange={onChange} />
        </div>
      ) : null}
    </div>
  );
}
