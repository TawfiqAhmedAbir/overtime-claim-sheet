import { useEffect, useRef, useState } from 'react';
import type { MonthSelection, OvertimeEntry } from '../types';
import {
  breakLabel,
  dayOfWeekIndex,
  formatEntryDate,
  formatTimeLabel,
  isBankHoliday,
  isWeekend,
} from '../lib/dates';
import EmptyMonthIllustration from './EmptyMonthIllustration';

interface EntryListProps {
  selection: MonthSelection;
  entries: OvertimeEntry[];
  highlightedId?: string | null;
  leavingId?: string | null;
  onEdit: (entry: OvertimeEntry) => void;
  onDelete: (entry: OvertimeEntry) => void;
  onLeaveComplete: () => void;
}

export default function EntryList({
  selection,
  entries,
  highlightedId,
  leavingId,
  onEdit,
  onDelete,
  onLeaveComplete,
}: EntryListProps) {
  const [openId, setOpenId] = useState<string | null>(null);

  useEffect(() => {
    setOpenId(null);
  }, [selection]);

  if (entries.length === 0) {
    return (
      <div className="empty-state panel">
        <EmptyMonthIllustration className="empty-state-illustration" />
        <strong>No overtime saved yet</strong>
        <p>Tap “Add overtime” when you work extra hours this month.</p>
      </div>
    );
  }

  return (
    <div className="entry-list">
      {entries.map((entry) => (
        <EntryRow
          key={entry.id}
          selection={selection}
          entry={entry}
          open={openId === entry.id}
          highlighted={highlightedId === entry.id}
          leaving={leavingId === entry.id}
          onOpen={() => setOpenId(entry.id)}
          onClose={() => setOpenId((current) => (current === entry.id ? null : current))}
          onEdit={onEdit}
          onDelete={onDelete}
          onLeaveComplete={onLeaveComplete}
        />
      ))}
    </div>
  );
}

interface EntryRowProps {
  selection: MonthSelection;
  entry: OvertimeEntry;
  open: boolean;
  highlighted: boolean;
  leaving: boolean;
  onOpen: () => void;
  onClose: () => void;
  onEdit: (entry: OvertimeEntry) => void;
  onDelete: (entry: OvertimeEntry) => void;
  onLeaveComplete: () => void;
}

function EntryRow({
  selection,
  entry,
  open,
  highlighted,
  leaving,
  onOpen,
  onClose,
  onEdit,
  onDelete,
  onLeaveComplete,
}: EntryRowProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const deleteRef = useRef<HTMLButtonElement>(null);
  const offsetRef = useRef(0);
  const draggingRef = useRef(false);
  const suppressClick = useRef(false);
  const drag = useRef<{
    id: number;
    startX: number;
    startY: number;
    origin: number;
    active: boolean;
  } | null>(null);
  const [offset, setOffset] = useState(0);
  const [dragging, setDragging] = useState(false);
  const dateLabel = formatEntryDate(selection, entry.day);
  const dayBadge = isBankHoliday(selection, entry.day)
    ? 'Bank holiday'
    : isWeekend(selection, entry.day)
      ? 'Weekend'
      : null;

  function setBoth(next: number) {
    offsetRef.current = next;
    setOffset(next);
  }

  function revealWidth() {
    return deleteRef.current?.offsetWidth ?? 92;
  }

  useEffect(() => {
    if (draggingRef.current) return;
    setBoth(open ? -revealWidth() : 0);
  }, [open]);

  useEffect(() => {
    if (!highlighted) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    rootRef.current?.scrollIntoView({
      behavior: reduce ? 'auto' : 'smooth',
      block: 'nearest',
    });
  }, [highlighted]);

  function onPointerDown(event: React.PointerEvent<HTMLButtonElement>) {
    if (event.button !== 0) return;
    drag.current = {
      id: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      origin: offsetRef.current,
      active: false,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function onPointerMove(event: React.PointerEvent<HTMLButtonElement>) {
    const dragState = drag.current;
    if (!dragState || event.pointerId !== dragState.id) return;
    const dx = event.clientX - dragState.startX;
    const dy = event.clientY - dragState.startY;
    if (!dragState.active) {
      if (Math.abs(dx) < 8 && Math.abs(dy) < 8) return;
      if (Math.abs(dy) > Math.abs(dx)) {
        drag.current = null;
        if (event.currentTarget.hasPointerCapture(event.pointerId)) {
          event.currentTarget.releasePointerCapture(event.pointerId);
        }
        return;
      }
      dragState.active = true;
      draggingRef.current = true;
      setDragging(true);
    }
    const next = Math.min(0, Math.max(-revealWidth(), dragState.origin + dx));
    setBoth(next);
  }

  function finishDrag(event: React.PointerEvent<HTMLButtonElement>) {
    const dragState = drag.current;
    if (!dragState || event.pointerId !== dragState.id) return;
    drag.current = null;
    draggingRef.current = false;
    setDragging(false);
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    if (!dragState.active) return;
    suppressClick.current = true;
    const width = revealWidth();
    if (offsetRef.current < -width / 2) {
      setBoth(-width);
      onOpen();
    } else {
      setBoth(0);
      onClose();
    }
  }

  function onCardClick() {
    if (suppressClick.current) {
      suppressClick.current = false;
      return;
    }
    if (open || offsetRef.current < -8) {
      setBoth(0);
      onClose();
      return;
    }
    onEdit(entry);
  }

  return (
    <div
      ref={rootRef}
      className={
        leaving
          ? 'entry-swipe is-leaving'
          : highlighted
            ? 'entry-swipe is-highlight'
            : 'entry-swipe'
      }
      onAnimationEnd={(event) => {
        if (event.target !== event.currentTarget) return;
        if (event.animationName.includes('entry-leave')) onLeaveComplete();
      }}
    >
      <article
        className={dragging ? 'entry-card is-dragging' : 'entry-card'}
        data-dow={dayOfWeekIndex(selection, entry.day)}
        style={{ transform: `translateX(${offset}px)` }}
      >
        <button
          type="button"
          className="entry-card-main"
          aria-label={`Edit ${dateLabel}`}
          onClick={onCardClick}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={finishDrag}
          onPointerCancel={finishDrag}
        >
          <div className="entry-date-row">
            <div className="entry-date">{dateLabel}</div>
            {dayBadge ? (
              <span className="entry-day-badge">{dayBadge}</span>
            ) : null}
          </div>
          <div className="entry-meta">
            {formatTimeLabel(entry.start)} – {formatTimeLabel(entry.finish)}
            {' · '}
            {breakLabel(entry.break)}
          </div>
          <div className="entry-claim">Claiming: {entry.shift}</div>
        </button>
      </article>
      <button
        ref={deleteRef}
        type="button"
        className="entry-swipe-delete"
        aria-label={`Delete ${dateLabel}`}
        onFocus={onOpen}
        onClick={() => onDelete(entry)}
      >
        Delete
      </button>
    </div>
  );
}
