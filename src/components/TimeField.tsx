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
  const [draftHour, setDraftHour] = useState('');
  const [draftMinute, setDraftMinute] = useState('');

  useEffect(() => {
    setSimplePicker(isAndroid());
  }, []);

  useEffect(() => {
    if (!value) return;
    const parts = splitTime(value);
    setDraftHour(parts.hour);
    setDraftMinute(parts.minute);
  }, [value]);

  const { hour, minute } = useMemo(() => {
    if (!value) return { hour: draftHour, minute: draftMinute };
    return splitTime(value);
  }, [draftHour, draftMinute, value]);

  function commit(nextHour: string, nextMinute: string) {
    if (nextHour && nextMinute) onChange(joinTime(nextHour, nextMinute));
  }

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
            onChange={(event) => {
              const nextHour = event.target.value;
              setDraftHour(nextHour);
              commit(nextHour, minute);
            }}
          >
            <option value="">Hour</option>
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
            onChange={(event) => {
              const nextMinute = event.target.value;
              setDraftMinute(nextMinute);
              commit(hour, nextMinute);
            }}
          >
            <option value="">Minute</option>
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
