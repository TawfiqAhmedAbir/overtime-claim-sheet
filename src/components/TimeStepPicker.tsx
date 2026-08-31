import TimeInput from './TimeInput';

export type TimeStep = 'start' | 'finish';

interface TimeStepPickerProps {
  start: string;
  finish: string;
  step: TimeStep;
  startConfirmed: boolean;
  onStepChange: (step: TimeStep) => void;
  onStartConfirmed: () => void;
  onStartChange: (value: string) => void;
  onFinishChange: (value: string) => void;
}

export default function TimeStepPicker({
  start,
  finish,
  step,
  startConfirmed,
  onStepChange,
  onStartConfirmed,
  onStartChange,
  onFinishChange,
}: TimeStepPickerProps) {
  function handleStartNext() {
    onStartConfirmed();
    onStepChange('finish');
  }

  return (
    <div className="time-step-picker">
      {startConfirmed && step === 'finish' ? (
        <button
          type="button"
          className="time-step-summary"
          onClick={() => onStepChange('start')}
        >
          <span className="time-step-summary-label">Start time</span>
          <span className="time-step-summary-value">{start}</span>
          <span className="time-step-summary-check" aria-hidden="true">✓</span>
        </button>
      ) : null}

      {step === 'start' ? (
        <div className="time-step">
          <span className="time-step-title">1. Start time</span>
          <TimeInput value={start} onChange={onStartChange} />
          <button type="button" className="primary-button time-step-next" onClick={handleStartNext}>
            Next →
          </button>
        </div>
      ) : null}

      {startConfirmed && step === 'finish' ? (
        <div className="time-step">
          <span className="time-step-title">2. Finish time</span>
          <TimeInput value={finish} onChange={onFinishChange} />
        </div>
      ) : null}
    </div>
  );
}
