import {
  allOvertimeOptions,
  formatShiftClaimFromMinutes,
} from '../lib/hours';

interface OvertimeFieldProps {
  value: string;
  onChange: (value: string) => void;
  calculatedValue: string;
  overridden: boolean;
  onSiteMinutes: number;
  normalShiftHours: number;
  fullOvertimeDay: boolean;
}

export default function OvertimeField({
  value,
  onChange,
  calculatedValue,
  overridden,
  onSiteMinutes,
  normalShiftHours,
  fullOvertimeDay,
}: OvertimeFieldProps) {
  const options = allOvertimeOptions(12);
  const onSiteText = formatShiftClaimFromMinutes(onSiteMinutes);
  const normalText = formatShiftClaimFromMinutes(
    Math.round(normalShiftHours * 60),
  );

  return (
    <div className="overtime-field">
      <div className="overtime-result">
        <span className="overtime-result-label">Overtime</span>
        <strong className="overtime-result-value">{value}</strong>
        {!overridden ? (
          <span className="overtime-result-note">Calculated for you</span>
        ) : (
          <span className="overtime-result-note overtime-result-note-override">
            You changed this — pick a different amount below
          </span>
        )}
      </div>

      <div className="overtime-breakdown">
        <span>Time on site: {onSiteText}</span>
        {fullOvertimeDay ? (
          <span>Whole shift counts (weekend / bank holiday)</span>
        ) : (
          <span>Minus normal shift: {normalText}</span>
        )}
        <span>
          = Overtime: <strong>{calculatedValue}</strong>
        </span>
      </div>

      {!overridden ? (
        <p className="overtime-calc-hint">
          Calculated for you — change below only if wrong.
        </p>
      ) : null}

      <div className="field">
        <label htmlFor="overtime-amount">Overtime amount</label>
        <select
          id="overtime-amount"
          value={value}
          onChange={(event) => onChange(event.target.value)}
        >
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
