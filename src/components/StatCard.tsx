import { useEffect, useRef, useState } from 'react';
import { ClockIcon } from './Icons';
import { formatHoursShort } from '../lib/hours';

interface StatCardProps {
  totalHours: number;
  entryCount: number;
}

function usePrefersReducedMotion() {
  const [reduce, setReduce] = useState(() =>
    window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  );

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = () => setReduce(media.matches);
    media.addEventListener('change', onChange);
    return () => media.removeEventListener('change', onChange);
  }, []);

  return reduce;
}

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

export default function StatCard({ totalHours, entryCount }: StatCardProps) {
  const reduceMotion = usePrefersReducedMotion();
  const animated = useAnimatedHours(totalHours, reduceMotion);
  const shown = Math.abs(animated - totalHours) < 0.02 ? totalHours : animated;

  return (
    <div className="stat-card">
      <div className="stat-card-icon">
        <ClockIcon size={22} />
      </div>
      <div className="stat-card-body">
        <span className="stat-card-label">Total this month</span>
        <strong className="stat-card-value">{formatHoursShort(shown)}</strong>
        <span className="stat-card-meta">
          {entryCount} {entryCount === 1 ? 'entry' : 'entries'}
        </span>
      </div>
    </div>
  );
}
