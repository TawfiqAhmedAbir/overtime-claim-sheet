import type { MonthSelection, OvertimeEntry } from '../types';
import { formatMonthLabel } from '../lib/dates';
import { formatTotalHours, sumShiftHours } from '../lib/hours';
import { canShareSpreadsheetFile } from '../lib/share';
import { useModalEnter } from '../hooks/useModalEnter';
import { DownloadIcon, ShareIcon } from './Icons';

interface DownloadModalProps {
  selection: MonthSelection;
  entries: OvertimeEntry[];
  loading: boolean;
  preparing: boolean;
  onConfirm: (mode: 'share' | 'download') => void;
  onClose: () => void;
}

export default function DownloadModal({
  selection,
  entries,
  loading,
  preparing,
  onConfirm,
  onClose,
}: DownloadModalProps) {
  const entered = useModalEnter(true);
  const total = sumShiftHours(entries.map((entry) => entry.shift));
  const canShare = canShareSpreadsheetFile();

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
        <h2 id="download-title">
          {canShare ? 'Send claim sheet' : 'Save claim sheet'}
        </h2>
        <p>
          <strong>{formatMonthLabel(selection)}</strong>
        </p>
        <p>
          {entries.length} {entries.length === 1 ? 'day' : 'days'} ·{' '}
          {formatTotalHours(total)}
        </p>
        <p>
          {canShare
            ? 'Share opens your phone’s usual list of apps (same as photos and files). Or save the sheet on this phone.'
            : 'This creates your official Excel claim sheet with all saved overtime for this month.'}
        </p>
        <div className="modal-actions">
          {canShare ? (
            <button
              type="button"
              className="primary-button"
              disabled={loading || preparing}
              onClick={() => onConfirm('share')}
            >
              <ShareIcon />
              {preparing ? 'Preparing file…' : 'Share…'}
            </button>
          ) : null}
          <button
            type="button"
            className={canShare ? 'secondary-button' : 'primary-button'}
            disabled={loading || preparing}
            onClick={() => onConfirm('download')}
          >
            <DownloadIcon />
            {preparing
              ? 'Preparing file…'
              : canShare
                ? 'Save to this phone'
                : 'Download'}
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
