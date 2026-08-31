import WheelPicker from './WheelPicker';
import {
  TIME_HOUR_OPTIONS,
  TIME_MINUTE_OPTIONS,
  joinTime,
  splitTime,
} from '../lib/hours';

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

function TimeWheelsInline({
  hour,
  minute,
  onHourChange,
  onMinuteChange,
}: {
  hour: string;
  minute: string;
  onHourChange: (hour: string) => void;
  onMinuteChange: (minute: string) => void;
}) {
  return (
    <div className="time-wheels-row">
      <WheelPicker
        label="Hour"
        options={TIME_HOUR_OPTIONS}
        value={hour}
        onChange={onHourChange}
      />
      <span className="time-wheels-sep">:</span>
      <WheelPicker
        label="Min"
        options={TIME_MINUTE_OPTIONS}
        value={minute}
        onChange={onMinuteChange}
        formatOption={(option) => option}
      />
    </div>
  );
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
  const startParts = splitTime(start);
  const finishParts = splitTime(finish);

  function updateStartHour(nextHour: string) {
    onStartChange(joinTime(nextHour, startParts.minute));
  }

  function updateStartMinute(nextMinute: string) {
    onStartChange(joinTime(startParts.hour, nextMinute));
  }

  function updateFinishHour(nextHour: string) {
    onFinishChange(joinTime(nextHour, finishParts.minute));
  }

  function updateFinishMinute(nextMinute: string) {
    onFinishChange(joinTime(finishParts.hour, nextMinute));
  }

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
          <TimeWheelsInline
            hour={startParts.hour}
            minute={startParts.minute}
            onHourChange={updateStartHour}
            onMinuteChange={updateStartMinute}
          />
          <button type="button" className="primary-button time-step-next" onClick={handleStartNext}>
            Next →
          </button>
        </div>
      ) : null}

      {startConfirmed && step === 'finish' ? (
        <div className="time-step">
          <span className="time-step-title">2. Finish time</span>
          <TimeWheelsInline
            hour={finishParts.hour}
            minute={finishParts.minute}
            onHourChange={updateFinishHour}
            onMinuteChange={updateFinishMinute}
          />
        </div>
      ) : null}
    </div>
  );
}
