import { useRef } from 'react';

const SWIPE_THRESHOLD = 60;

function isInteractiveTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false;
  return Boolean(target.closest('button, input, select, textarea, a, label'));
}

export function useHorizontalSwipe(onSwipeLeft: () => void, onSwipeRight: () => void) {
  const drag = useRef<{
    id: number;
    startX: number;
    startY: number;
    active: boolean;
  } | null>(null);

  function onPointerDown(event: React.PointerEvent<HTMLElement>) {
    if (event.button !== 0 || isInteractiveTarget(event.target)) return;
    drag.current = {
      id: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      active: false,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function onPointerMove(event: React.PointerEvent<HTMLElement>) {
    const state = drag.current;
    if (!state || event.pointerId !== state.id) return;
    const dx = event.clientX - state.startX;
    const dy = event.clientY - state.startY;
    if (!state.active) {
      if (Math.abs(dx) < 10 && Math.abs(dy) < 10) return;
      if (Math.abs(dy) > Math.abs(dx)) {
        drag.current = null;
        if (event.currentTarget.hasPointerCapture(event.pointerId)) {
          event.currentTarget.releasePointerCapture(event.pointerId);
        }
        return;
      }
      state.active = true;
    }
  }

  function finish(event: React.PointerEvent<HTMLElement>) {
    const state = drag.current;
    if (!state || event.pointerId !== state.id) return;
    drag.current = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    if (!state.active) return;
    const dx = event.clientX - state.startX;
    if (dx <= -SWIPE_THRESHOLD) onSwipeLeft();
    else if (dx >= SWIPE_THRESHOLD) onSwipeRight();
  }

  return {
    onPointerDown,
    onPointerMove,
    onPointerUp: finish,
    onPointerCancel: finish,
  };
}
