export const XLSX_MIME =
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

export function canShareSpreadsheetFile(): boolean {
  if (typeof navigator === 'undefined' || !navigator.canShare) {
    return false;
  }
  try {
    const probe = new File([''], 'test.xlsx', { type: XLSX_MIME });
    return navigator.canShare({ files: [probe] });
  } catch {
    return false;
  }
}

export function canShareFile(file: File): boolean {
  if (typeof navigator === 'undefined' || !navigator.canShare) {
    return false;
  }
  try {
    return navigator.canShare({ files: [file] });
  } catch {
    return false;
  }
}

export function isShareDenied(error: unknown): boolean {
  if (error instanceof DOMException && error.name === 'NotAllowedError') {
    return true;
  }
  return error instanceof Error && error.message === 'Permission denied';
}

export async function shareFile(
  file: File,
  options?: { title?: string; text?: string },
): Promise<void> {
  await navigator.share({
    files: [file],
    title: options?.title,
    text: options?.text,
  });
}
