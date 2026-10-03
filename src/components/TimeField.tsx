import { useEffect, useMemo, useState } from 'react';
import { isAndroid } from '../lib/platform';
import { joinTime, splitTime } from '../lib/hours';

interface TimeFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
}

const HOUR_OPTIONS = Array.from({ length: 24 }, (_, index) =>
  String(index).padStart(2, '0'),
);
const MINUTE_OPTIONS = Array.from({ length: 60 }, (_, index) =>
  String(index).padStart(2, '0'),
);

export default function TimeField({ id, label, value, onChange }: TimeFieldProps) {
  const [simplePicker, setSimplePicker] = useState(false);

  useEffect(() => {
    setSimplePicker(isAndroid());
  }, []);

  const { hour, minute } = useMemo(() => splitTime(value), [value]);

  if (!simplePicker) {
    return (
      <div className="field">
        <label htmlFor={id}>{label}</label>
        <input
          id={id}
          type="time"
          className="time-field-input"
          value={value}
          onChange={(event) => onChange(event.target.value)}
        />
      </div>
    );
  }

  return (
    <div className="field">
      <span className="field-label">{label}</span>
      <div className="time-select-row">
        <div className="time-select-field">
          <label htmlFor={`${id}-hour`}>Hour</label>
          <select
            id={`${id}-hour`}
            className="time-select-input"
            value={hour}
            onChange={(event) => onChange(joinTime(event.target.value, minute))}
          >
            {HOUR_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
        <div className="time-select-field">
          <label htmlFor={`${id}-minute`}>Minute</label>
          <select
            id={`${id}-minute`}
            className="time-select-input"
            value={minute}
            onChange={(event) => onChange(joinTime(hour, event.target.value))}
          >
            {MINUTE_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
