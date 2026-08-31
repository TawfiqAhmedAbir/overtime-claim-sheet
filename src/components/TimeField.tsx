interface TimeFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
}

export default function TimeField({ id, label, value, onChange }: TimeFieldProps) {
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
