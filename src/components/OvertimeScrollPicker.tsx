import ScrollPicker from './ScrollPicker';
import {
  allOvertimeOptions,
  formatShiftClaimFromMinutes,
} from '../lib/hours';

interface OvertimeScrollPickerProps {
  value: string;
  onChange: (value: string) => void;
  calculatedValue: string;
  overridden: boolean;
  onSiteMinutes: number;
  normalShiftHours: number;
  fullOvertimeDay: boolean;
}

export default function OvertimeScrollPicker({
  value,
  onChange,
  calculatedValue,
  overridden,
  onSiteMinutes,
  normalShiftHours,
  fullOvertimeDay,
}: OvertimeScrollPickerProps) {
  const options = allOvertimeOptions(12);
  const onSiteText = formatShiftClaimFromMinutes(onSiteMinutes);
  const normalText = formatShiftClaimFromMinutes(
    Math.round(normalShiftHours * 60),
  );

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
          Not right? Scroll below to pick a different amount.
        </p>
      ) : null}

      <ScrollPicker
        label="Overtime hours"
        options={options}
        value={value}
        onChange={onChange}
      />
    </div>
  );
}
