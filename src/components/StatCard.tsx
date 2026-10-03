import { useEffect, useRef, useState } from 'react';
import { formatHoursShort } from '../lib/hours';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';

interface StatCardProps {
  totalHours: number;
  entryCount: number;
  ringGoalHours: number;
}
const RING_SIZE = 76;
const STROKE = 7;
const RADIUS = (RING_SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

function useAnimatedHours(target: number, reduce: boolean) {
  const [value, setValue] = useState(target);
  const valueRef = useRef(target);

  useEffect(() => {
    if (reduce) {
      valueRef.current = target;
      setValue(target);
      return undefined;
    }

    const from = valueRef.current;
    if (from === target) return undefined;

    const start = performance.now();
    const duration = 450;
    let frame = 0;

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - (1 - t) ** 3;
      const next = t === 1 ? target : from + (target - from) * eased;
      valueRef.current = next;
      setValue(next);
      if (t < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, reduce]);

  return reduce ? target : value;
}

export default function StatCard({
  totalHours,
  entryCount,
  ringGoalHours,
}: StatCardProps) {
  const reduceMotion = usePrefersReducedMotion();
  const animated = useAnimatedHours(totalHours, reduceMotion);
  const shown = Math.abs(animated - totalHours) < 0.02 ? totalHours : animated;
  const goal = ringGoalHours > 0 ? ringGoalHours : 40;
  const progress = Math.min(shown / goal, 1);
  const dashOffset = CIRCUMFERENCE * (1 - progress);

  return (
    <div className="stat-card">
      <div className="stat-card-ring-wrap" aria-hidden="true">
        <svg
          className="stat-card-ring"
          width={RING_SIZE}
          height={RING_SIZE}
          viewBox={`0 0 ${RING_SIZE} ${RING_SIZE}`}
        >
          <circle
            className="stat-card-ring-track"
            cx={RING_SIZE / 2}
            cy={RING_SIZE / 2}
            r={RADIUS}
            fill="none"
            strokeWidth={STROKE}
          />
          <circle
            className="stat-card-ring-progress"
            cx={RING_SIZE / 2}
            cy={RING_SIZE / 2}
            r={RADIUS}
            fill="none"
            strokeWidth={STROKE}
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={dashOffset}
            strokeLinecap="round"
            transform={`rotate(-90 ${RING_SIZE / 2} ${RING_SIZE / 2})`}
          />
        </svg>
        <strong className="stat-card-ring-value">{formatHoursShort(shown)}</strong>
      </div>
      <div className="stat-card-body">
        <span className="stat-card-label">Total this month</span>
        <span className="stat-card-meta">
          {entryCount} {entryCount === 1 ? 'entry' : 'entries'}
        </span>
      </div>
    </div>
  );
}
