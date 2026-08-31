import Stepper from './Stepper';
import { joinTime, splitTime } from '../lib/hours';

interface TimeInputProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
}

export default function TimeInput({ label, value, onChange }: TimeInputProps) {
  const { hour, minute } = splitTime(value);
  const hourNum = Number(hour);
  const minuteNum = Number(minute);

  function updateHour(nextHour: number) {
    onChange(joinTime(String(nextHour).padStart(2, '0'), minute));
  }

  function updateMinute(nextMinute: number) {
    onChange(joinTime(hour, String(nextMinute).padStart(2, '0')));
  }

  return (
    <div className="time-input">
      {label ? <span className="field-label">{label}</span> : null}
      <div className="time-input-row">
        <Stepper
          label="Hour"
          value={hourNum}
          min={0}
          max={23}
          step={1}
          onChange={updateHour}
          formatValue={(v) => String(v).padStart(2, '0')}
        />
        <span className="time-input-sep">:</span>
        <Stepper
          label="Min"
          value={minuteNum}
          min={0}
          max={59}
          step={1}
          onChange={updateMinute}
          formatValue={(v) => String(v).padStart(2, '0')}
        />
      </div>
    </div>
  );
}
