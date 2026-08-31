import { useCallback, useEffect, useRef } from 'react';

export const WHEEL_ITEM_HEIGHT = 44;

interface WheelPickerProps {
  label: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
  formatOption?: (value: string) => string;
}

export default function WheelPicker({
  label,
  options,
  value,
  onChange,
  formatOption = (option) => option,
}: WheelPickerProps) {
  const windowRef = useRef<HTMLDivElement>(null);
  const userScrollingRef = useRef(false);
  const debounceRef = useRef<number | null>(null);

  const syncScrollToIndex = useCallback((index: number) => {
    const el = windowRef.current;
    if (!el) return;
    el.scrollTop = index * WHEEL_ITEM_HEIGHT;
  }, []);

  useEffect(() => {
    if (userScrollingRef.current) return;
    const index = options.indexOf(value);
    if (index >= 0) syncScrollToIndex(index);
  }, [value, options, syncScrollToIndex]);

  useEffect(() => {
    return () => {
      if (debounceRef.current) window.clearTimeout(debounceRef.current);
    };
  }, []);

  function handleScroll() {
    userScrollingRef.current = true;
    if (debounceRef.current) window.clearTimeout(debounceRef.current);
    debounceRef.current = window.setTimeout(() => {
      const el = windowRef.current;
      if (!el) return;
      const index = Math.round(el.scrollTop / WHEEL_ITEM_HEIGHT);
      const clamped = Math.max(0, Math.min(options.length - 1, index));
      syncScrollToIndex(clamped);
      const next = options[clamped];
      if (next !== undefined && next !== value) onChange(next);
      userScrollingRef.current = false;
    }, 80);
  }

  return (
    <div className="wheel-picker">
      <span className="wheel-picker-label">{label}</span>
      <div className="wheel-picker-frame">
        <div className="wheel-picker-highlight" aria-hidden="true" />
        <div
          ref={windowRef}
          className="wheel-picker-window"
          role="listbox"
          aria-label={label}
          onScroll={handleScroll}
        >
          {options.map((option) => {
            const active = option === value;
            return (
              <div
                key={option}
                role="option"
                aria-selected={active}
                className={`wheel-picker-item ${active ? 'is-selected' : ''}`}
              >
                {formatOption(option)}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
