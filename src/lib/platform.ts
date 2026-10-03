export function isAndroid(): boolean {
  if (typeof navigator === 'undefined') return false;
  return /Android/i.test(navigator.userAgent);
}

export function isInstalledApp(): boolean {
  if (typeof window === 'undefined') return false;
  const standalone = (navigator as Navigator & { standalone?: boolean }).standalone;
  return (
    standalone === true ||
    window.matchMedia('(display-mode: standalone)').matches ||
    window.matchMedia('(display-mode: fullscreen)').matches
  );
}
