export function lightHaptic(): void {
  if (typeof navigator === 'undefined' || !navigator.vibrate) return;
  try {
    navigator.vibrate(10);
  } catch {
    // ignore unsupported vibrate
  }
}
