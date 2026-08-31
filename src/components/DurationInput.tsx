import Stepper from './Stepper';
import {
  breakLabel,
  breakMinutesFromOption,
  breakMinutesToParts,
  formatBreakOption,
} from '../lib/hours';
import type { BreakOption } from '../types';

interface DurationInputProps {
  value: BreakOption;
  onChange: (value: BreakOption) => void;
}

export default function DurationInput({ value, onChange }: DurationInputProps) {
  const totalMinutes = breakMinutesFromOption(value);
  const parts = breakMinutesToParts(totalMinutes);
  const hourNum = Number(parts.hour);
  const minuteNum = Number(parts.minute);
  const minuteMax = hourNum >= 2 ? 0 : 45;

  function emit(hour: number, minute: number) {
    const total = Math.min(120, hour * 60 + minute);
    onChange(formatBreakOption(total) as BreakOption);
  }

  function updateHour(nextHour: number) {
    const minute = nextHour >= 2 ? 0 : minuteNum;
    emit(nextHour, minute);
  }

  function updateMinute(nextMinute: number) {
    emit(hourNum, nextMinute);
  }

  return (
    <div className="duration-input">
      <div className="duration-input-row">
        <Stepper
          label="Hour"
          value={hourNum}
          min={0}
          max={2}
          step={1}
          onChange={updateHour}
        />
        <span className="time-input-sep">:</span>
        <Stepper
          label="Min"
          value={minuteNum}
          min={0}
          max={minuteMax}
          step={15}
          onChange={updateMinute}
          formatValue={(v) => String(v).padStart(2, '0')}
        />
      </div>
      <p className="break-picker-custom-value">
        Selected: <strong>{breakLabel(value)}</strong>
      </p>
    </div>
  );
}
