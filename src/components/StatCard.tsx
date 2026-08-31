import { ClockIcon } from './Icons';
import { formatHoursShort } from '../lib/hours';

interface StatCardProps {
  totalHours: number;
  entryCount: number;
}

export default function StatCard({ totalHours, entryCount }: StatCardProps) {
  return (
    <div className="stat-card">
      <div className="stat-card-icon">
        <ClockIcon size={22} />
      </div>
      <div className="stat-card-body">
        <span className="stat-card-label">Total this month</span>
        <strong className="stat-card-value">{formatHoursShort(totalHours)}</strong>
        <span className="stat-card-meta">
          {entryCount} {entryCount === 1 ? 'entry' : 'entries'}
        </span>
      </div>
    </div>
  );
}
