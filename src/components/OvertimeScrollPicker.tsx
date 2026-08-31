import ScrollPicker from './ScrollPicker';
import { allOvertimeOptions } from '../lib/hours';

interface OvertimeScrollPickerProps {
  value: string;
  onChange: (value: string) => void;
  calculatedValue: string;
  overridden: boolean;
}

export default function OvertimeScrollPicker({
  value,
  onChange,
  calculatedValue,
  overridden,
}: OvertimeScrollPickerProps) {
  const options = allOvertimeOptions(12);

  return (
    <div className="overtime-scroll-picker">
      <div className="overtime-result">
        <span className="overtime-result-label">Overtime</span>
        <strong className="overtime-result-value">{value}</strong>
        {!overridden ? (
          <span className="overtime-result-note">Calculated for you</span>
        ) : (
          <span className="overtime-result-note overtime-result-note-override">
            You changed this — scroll to adjust
          </span>
        )}
      </div>
      {!overridden ? (
        <p className="overtime-calc-hint">
          Based on your times minus your normal shift. Not right? Scroll below to
          change it.
        </p>
      ) : null}
      <ScrollPicker
        label="Overtime hours"
        options={options}
        value={value}
        onChange={onChange}
      />
      {!overridden && value !== calculatedValue ? null : null}
    </div>
  );
}
