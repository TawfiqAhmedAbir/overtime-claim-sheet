import type { MonthSelection, OvertimeEntry } from '../types';
import { formatMonthLabel } from '../lib/dates';
import { formatTotalHours, sumShiftHours } from '../lib/hours';

interface DownloadModalProps {
  selection: MonthSelection;
  entries: OvertimeEntry[];
  loading: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

export default function DownloadModal({
  selection,
  entries,
  loading,
  onConfirm,
  onClose,
}: DownloadModalProps) {
  const total = sumShiftHours(entries.map((entry) => entry.shift));

  return (
    <div className="modal-backdrop" role="presentation">
      <div className="modal-card" role="dialog" aria-modal="true">
        <h2>Download claim sheet</h2>
        <p>
          <strong>{formatMonthLabel(selection)}</strong>
        </p>
        <p>
          {entries.length} {entries.length === 1 ? 'day' : 'days'} ·{' '}
          {formatTotalHours(total)}
        </p>
        <p>
          This creates your official Excel claim sheet with all saved overtime
          for this month.
        </p>
        <div className="modal-actions">
          <button
            type="button"
            className="primary-button"
            disabled={loading}
            onClick={onConfirm}
          >
            {loading ? 'Preparing file…' : 'Download now'}
          </button>
          <button
            type="button"
            className="secondary-button"
            disabled={loading}
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
