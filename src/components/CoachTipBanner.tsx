interface CoachTipBannerProps {
  message: string;
  onDismiss: () => void;
}

export default function CoachTipBanner({ message, onDismiss }: CoachTipBannerProps) {
  return (
    <div className="tip-banner panel">
      <p>{message}</p>
      <button type="button" className="tip-dismiss" onClick={onDismiss}>
        Got it
      </button>
    </div>
  );
}
