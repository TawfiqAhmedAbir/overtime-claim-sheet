import type { MonthSelection, OvertimeEntry } from '../types';
import {
  breakLabel,
  formatEntryDate,
  formatTimeLabel,
} from '../lib/dates';

interface EntryListProps {
  selection: MonthSelection;
  entries: OvertimeEntry[];
  onEdit: (entry: OvertimeEntry) => void;
  onDelete: (entry: OvertimeEntry) => void;
}

export default function EntryList({
  selection,
  entries,
  onEdit,
  onDelete,
}: EntryListProps) {
  if (entries.length === 0) {
    return (
      <div className="empty-state panel">
        <strong>No overtime saved yet</strong>
        <p>Tap “Add overtime” when you work extra hours this month.</p>
      </div>
    );
  }

  return (
    <div className="entry-list">
      {entries.map((entry) => (
        <article className="entry-card" key={entry.id}>
          <div className="entry-card-header">
            <div>
              <h3>{formatEntryDate(selection, entry.day)}</h3>
              <div className="entry-meta">
                {formatTimeLabel(entry.start)} – {formatTimeLabel(entry.finish)}
                {' · '}
                {breakLabel(entry.break)}
              </div>
              <div className="entry-claim">Claiming: {entry.shift}</div>
            </div>
            <div className="entry-actions">
              <button
                type="button"
                className="text-button"
                onClick={() => onEdit(entry)}
              >
                Edit
              </button>
              <button
                type="button"
                className="text-button"
                onClick={() => onDelete(entry)}
              >
                Delete
              </button>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
