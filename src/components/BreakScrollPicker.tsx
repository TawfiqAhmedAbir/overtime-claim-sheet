import ScrollPicker from './ScrollPicker';
import type { BreakOption } from '../types';
import { BREAK_OPTIONS, breakLabel } from '../lib/hours';

interface BreakScrollPickerProps {
  value: BreakOption;
  onChange: (value: BreakOption) => void;
}

export default function BreakScrollPicker({
  value,
  onChange,
}: BreakScrollPickerProps) {
  return (
    <div className="break-scroll-picker">
      <span className="field-label">Break</span>
      <ScrollPicker
        label="Break length"
        options={BREAK_OPTIONS}
        value={value}
        onChange={(option) => onChange(option as BreakOption)}
        formatOption={(option) => breakLabel(option as BreakOption)}
      />
    </div>
  );
}
