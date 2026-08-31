import { useMemo } from 'react';
import type { MonthSelection, OvertimeEntry } from '../types';
import { formatMonthLabel } from '../lib/dates';
import { formatTotalHours, sumShiftHours } from '../lib/hours';
import { DownloadIcon, ShareIcon } from './Icons';

interface DownloadModalProps {
  selection: MonthSelection;
  entries: OvertimeEntry[];
  loading: boolean;
  onConfirm: (mode: 'share' | 'download') => void;
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

  const canShare = useMemo(() => {
    if (typeof navigator === 'undefined' || !navigator.canShare) return false;
    try {
      const probe = new File([''], 'test.xlsx', {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      return navigator.canShare({ files: [probe] });
    } catch {
      return false;
    }
  }, []);

  return (
    <div
      className="modal-backdrop"
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
        <h2 id="download-title">Download claim sheet</h2>
        <p>
          <strong>{formatMonthLabel(selection)}</strong>
        </p>
        <p>
          {entries.length} {entries.length === 1 ? 'day' : 'days'} ·{' '}
          {formatTotalHours(total)}
        </p>
        <p>
          {canShare
            ? 'Share or download your official Excel claim sheet with all saved overtime for this month.'
            : 'This creates your official Excel claim sheet with all saved overtime for this month.'}
        </p>
        <div className="modal-actions">
          {canShare ? (
            <button
              type="button"
              className="primary-button"
              disabled={loading}
              onClick={() => onConfirm('share')}
            >
              <ShareIcon size={18} />
              {loading ? 'Preparing file…' : 'Share with work'}
            </button>
          ) : null}
          <button
            type="button"
            className={canShare ? 'secondary-button' : 'primary-button'}
            disabled={loading}
            onClick={() => onConfirm('download')}
          >
            <DownloadIcon size={18} />
            {loading ? 'Preparing file…' : canShare ? 'Download instead' : 'Download now'}
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
