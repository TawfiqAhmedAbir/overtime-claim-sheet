import ScrollPicker from './ScrollPicker';
import { TIME_HOUR_OPTIONS, TIME_MINUTE_OPTIONS } from '../lib/hours';

interface TimeScrollPickerProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

function splitTime(value: string): { hour: string; minute: string } {
  const [hour = '07', minute = '00'] = value.split(':');
  const snapped = TIME_MINUTE_OPTIONS.includes(minute)
    ? minute
    : TIME_MINUTE_OPTIONS.reduce((closest, option) => {
        const diff = Math.abs(Number(option) - Number(minute));
        const closestDiff = Math.abs(Number(closest) - Number(minute));
        return diff < closestDiff ? option : closest;
      }, '00');
  return {
    hour: hour.padStart(2, '0'),
    minute: snapped,
  };
}

export default function TimeScrollPicker({
  label,
  value,
  onChange,
}: TimeScrollPickerProps) {
  const { hour, minute } = splitTime(value);

  function updateHour(nextHour: string) {
    onChange(`${nextHour}:${minute}`);
  }

  function updateMinute(nextMinute: string) {
    onChange(`${hour}:${nextMinute}`);
  }

  return (
    <div className="time-scroll-picker">
      <span className="field-label">{label}</span>
      <div className="time-scroll-picker-row">
        <ScrollPicker
          label="Hour"
          options={TIME_HOUR_OPTIONS}
          value={hour}
          onChange={updateHour}
        />
        <span className="time-scroll-picker-sep">:</span>
        <ScrollPicker
          label="Min"
          options={TIME_MINUTE_OPTIONS}
          value={minute}
          onChange={updateMinute}
          formatOption={(option) => option}
        />
      </div>
      <p className="time-scroll-picker-value">
        Selected: <strong>{hour}:{minute}</strong>
      </p>
    </div>
  );
}
