interface StepperProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
  formatValue?: (value: number) => string;
}

function clampStep(value: number, min: number, max: number, step: number): number {
  const snapped = Math.round(value / step) * step;
  return Math.min(max, Math.max(min, snapped));
}

export default function Stepper({
  label,
  value,
  min,
  max,
  step,
  onChange,
  formatValue = (v) => String(v),
}: StepperProps) {
  const atMin = value <= min;
  const atMax = value >= max;

  function adjust(delta: number) {
    onChange(clampStep(value + delta * step, min, max, step));
  }

  return (
    <div className="stepper">
      <span className="stepper-label">{label}</span>
      <div className="stepper-row">
        <button
          type="button"
          className="stepper-btn"
          aria-label={`Decrease ${label}`}
          disabled={atMin}
          onClick={() => adjust(-1)}
        >
          −
        </button>
        <span className="stepper-value">{formatValue(value)}</span>
        <button
          type="button"
          className="stepper-btn"
          aria-label={`Increase ${label}`}
          disabled={atMax}
          onClick={() => adjust(1)}
        >
          +
        </button>
      </div>
    </div>
  );
}
