import { useMemo, useState } from 'react';
import WheelPicker from './WheelPicker';
import type { BreakOption } from '../types';
import {
  BREAK_HOUR_OPTIONS,
  BREAK_MINUTE_OPTIONS,
  BREAK_QUICK_OPTIONS,
  breakLabel,
  breakMinutesFromOption,
  breakMinutesToParts,
  breakPartsToOption,
  isQuickBreakOption,
} from '../lib/hours';

interface BreakPickerProps {
  value: BreakOption;
  onChange: (value: BreakOption) => void;
}

export default function BreakPicker({ value, onChange }: BreakPickerProps) {
  const initialCustom = !isQuickBreakOption(value);
  const [showCustom, setShowCustom] = useState(initialCustom);

  const customParts = useMemo(
    () => breakMinutesToParts(breakMinutesFromOption(value)),
    [value],
  );

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

  function updateCustomHour(hour: string) {
    onChange(breakPartsToOption(hour, customParts.minute));
  }

  function updateCustomMinute(minute: string) {
    onChange(breakPartsToOption(customParts.hour, minute));
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
          <div className="time-wheels-row">
            <WheelPicker
              label="Hour"
              options={BREAK_HOUR_OPTIONS}
              value={customParts.hour}
              onChange={updateCustomHour}
            />
            <span className="time-wheels-sep">:</span>
            <WheelPicker
              label="Min"
              options={BREAK_MINUTE_OPTIONS}
              value={customParts.minute}
              onChange={updateCustomMinute}
              formatOption={(option) => option}
            />
          </div>
          <p className="break-picker-custom-value">
            Selected: <strong>{breakLabel(value)}</strong>
          </p>
        </div>
      ) : null}
    </div>
  );
}
