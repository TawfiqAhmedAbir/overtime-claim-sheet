import type { MonthSelection, OvertimeEntry } from '../types';
import { formatMonthLabel } from '../lib/dates';
import { formatTotalHours, sumShiftHours } from '../lib/hours';
import { useModalEnter } from '../hooks/useModalEnter';
import { DownloadIcon } from './Icons';

interface DownloadModalProps {
  selection: MonthSelection;
  entries: OvertimeEntry[];
  preparing: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

export default function DownloadModal({
  selection,
  entries,
  preparing,
  onConfirm,
  onClose,
}: DownloadModalProps) {
  const entered = useModalEnter(true);
  const total = sumShiftHours(entries.map((entry) => entry.shift));

  return (
    <div
      className={entered ? 'modal-backdrop is-open' : 'modal-backdrop'}
      role="presentation"
      onClick={onClose}
    >
      <div
        className="modal-card"
        role="dialog"
        aria-modal="true"
        aria-labelledby="download-title"
        onClick={(event) => event.stopPropagation()}
      >
        <h2 id="download-title">Save claim sheet</h2>
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
            disabled={preparing}
            onClick={onConfirm}
          >
            <DownloadIcon />
            {preparing ? 'Preparing file…' : 'Download'}
          </button>
          <button type="button" className="secondary-button" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
