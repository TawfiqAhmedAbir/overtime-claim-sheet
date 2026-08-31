interface ConfirmSheetProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'default' | 'danger';
  alertOnly?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmSheet({
  open,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'default',
  alertOnly = false,
  onConfirm,
  onCancel,
}: ConfirmSheetProps) {
  if (!open) return null;

  return (
    <div
      className="modal-backdrop"
      role="presentation"
      onClick={onCancel}
    >
      <div
        className="modal-card confirm-sheet"
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
        onClick={(event) => event.stopPropagation()}
      >
        <h2 id="confirm-title">{title}</h2>
        <p>{message}</p>
        <div className="modal-actions">
          <button
            type="button"
            className={
              variant === 'danger' ? 'danger-button' : 'primary-button'
            }
            onClick={onConfirm}
          >
            {alertOnly ? 'OK' : confirmLabel}
          </button>
          {!alertOnly ? (
            <button
              type="button"
              className="secondary-button"
              onClick={onCancel}
            >
              {cancelLabel}
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
