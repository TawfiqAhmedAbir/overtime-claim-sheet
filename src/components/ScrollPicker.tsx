import { useEffect, useRef } from 'react';

interface ScrollPickerProps {
  label: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
  formatOption?: (value: string) => string;
}

export default function ScrollPicker({
  label,
  options,
  value,
  onChange,
  formatOption = (option) => option,
}: ScrollPickerProps) {
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const active = list.querySelector<HTMLElement>('[data-active="true"]');
    active?.scrollIntoView({ block: 'center' });
  }, [value]);

  return (
    <div className="scroll-picker-column">
      <span className="scroll-picker-label">{label}</span>
      <p className="scroll-picker-hint">Scroll up or down to choose</p>
      <div className="scroll-picker-list" ref={listRef} role="listbox" aria-label={label}>
        {options.map((option, index) => {
          const active = option === value;
          return (
            <button
              key={`${option}-${index}`}
              type="button"
              role="option"
              aria-selected={active}
              data-active={active ? 'true' : 'false'}
              className={`scroll-picker-item ${active ? 'active' : ''}`}
              onClick={() => onChange(option)}
            >
              {formatOption(option)}
            </button>
          );
        })}
      </div>
    </div>
  );
}
