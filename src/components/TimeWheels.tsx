import WheelPicker from './WheelPicker';
import {
  TIME_HOUR_OPTIONS,
  TIME_MINUTE_OPTIONS,
  joinTime,
  splitTime,
} from '../lib/hours';

interface TimeWheelsProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

export default function TimeWheels({ label, value, onChange }: TimeWheelsProps) {
  const { hour, minute } = splitTime(value);

  return (
    <div className="time-wheels">
      <span className="field-label">{label}</span>
      <div className="time-wheels-row">
        <WheelPicker
          label="Hour"
          options={TIME_HOUR_OPTIONS}
          value={hour}
          onChange={(nextHour) => onChange(joinTime(nextHour, minute))}
        />
        <span className="time-wheels-sep">:</span>
        <WheelPicker
          label="Min"
          options={TIME_MINUTE_OPTIONS}
          value={minute}
          onChange={(nextMinute) => onChange(joinTime(hour, nextMinute))}
          formatOption={(option) => option}
        />
      </div>
    </div>
  );
}
