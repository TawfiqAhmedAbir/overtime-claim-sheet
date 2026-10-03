interface EmptyMonthIllustrationProps {
  className?: string;
}

export default function EmptyMonthIllustration({
  className,
}: EmptyMonthIllustrationProps) {
  return (
    <svg
      className={className}
      width={120}
      height={100}
      viewBox="0 0 120 100"
      fill="none"
      aria-hidden="true"
    >
      <rect
        x={28}
        y={18}
        width={64}
        height={58}
        rx={10}
        fill="var(--ill-cal-fill)"
        stroke="var(--ill-cal-stroke)"
        strokeWidth={2}
      />
      <rect x={28} y={18} width={64} height={14} rx={10} fill="var(--ill-cal-header)" />
      <circle cx={40} cy={25} r={2.5} fill="var(--color-on-primary)" />
      <circle cx={48} cy={25} r={2.5} fill="var(--color-on-primary)" />
      <circle cx={56} cy={25} r={2.5} fill="var(--color-on-primary)" />
      <rect x={36} y={40} width={10} height={10} rx={2} fill="var(--ill-tile-a)" />
      <rect x={52} y={40} width={10} height={10} rx={2} fill="var(--ill-tile-b)" />
      <rect x={68} y={40} width={10} height={10} rx={2} fill="var(--ill-tile-a)" />
      <rect x={36} y={56} width={10} height={10} rx={2} fill="var(--ill-tile-b)" />
      <rect x={52} y={56} width={10} height={10} rx={2} fill="var(--ill-tile-a)" />
      <circle
        cx={88}
        cy={72}
        r={22}
        fill="var(--ill-clock-fill)"
        stroke="var(--ill-clock-stroke)"
        strokeWidth={2.5}
      />
      <circle cx={88} cy={72} r={2.5} fill="var(--ill-clock-stroke)" />
      <path
        d="M88 72V62"
        stroke="var(--ill-clock-stroke)"
        strokeWidth={2.5}
        strokeLinecap="round"
      />
      <path
        d="M88 72l6 4"
        stroke="var(--ill-clock-stroke)"
        strokeWidth={2.5}
        strokeLinecap="round"
      />
    </svg>
  );
}
