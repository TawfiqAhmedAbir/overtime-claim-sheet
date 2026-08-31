import Stepper from './Stepper';
import {
  formatShiftClaimFromMinutes,
  overtimePartsFromText,
  overtimeTextFromParts,
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
  const parts = overtimePartsFromText(value);
  const onSiteText = formatShiftClaimFromMinutes(onSiteMinutes);
  const normalText = formatShiftClaimFromMinutes(
    Math.round(normalShiftHours * 60),
  );

  function updateHours(hours: number) {
    onChange(overtimeTextFromParts(hours, parts.minutes));
  }

  function updateMinutes(minutes: number) {
    onChange(overtimeTextFromParts(parts.hours, minutes));
  }

  return (
    <div className="overtime-field">
      <div className="overtime-result">
        <span className="overtime-result-label">Overtime</span>
        <strong className="overtime-result-value">{value}</strong>
        {!overridden ? (
          <span className="overtime-result-note">Calculated for you</span>
        ) : (
          <span className="overtime-result-note overtime-result-note-override">
            You changed this — tap +/− to adjust
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
          Not right? Tap +/− below to pick a different amount.
        </p>
      ) : null}

      <div className="overtime-stepper-row">
        <Stepper
          label="Hours"
          value={parts.hours}
          min={0}
          max={12}
          step={1}
          onChange={updateHours}
        />
        <Stepper
          label="Minutes"
          value={parts.minutes}
          min={0}
          max={30}
          step={30}
          onChange={updateMinutes}
          formatValue={(v) => String(v).padStart(2, '0')}
        />
      </div>
    </div>
  );
}
