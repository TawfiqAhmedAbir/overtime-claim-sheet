import { useEffect, useState } from 'react';

/** Enables one-frame enter animation for bottom sheets. */
export function useModalEnter(open: boolean) {
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    if (!open) {
      setEntered(false);
      return undefined;
    }
    const id = window.requestAnimationFrame(() => setEntered(true));
    return () => window.cancelAnimationFrame(id);
  }, [open]);

  return entered;
}
