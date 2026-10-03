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
        fill="#ecfdf5"
        stroke="#0d9488"
        strokeWidth={2}
      />
      <rect x={28} y={18} width={64} height={14} rx={10} fill="#0d9488" />
      <circle cx={40} cy={25} r={2.5} fill="#fff" />
      <circle cx={48} cy={25} r={2.5} fill="#fff" />
      <circle cx={56} cy={25} r={2.5} fill="#fff" />
      <rect x={36} y={40} width={10} height={10} rx={2} fill="#99f6e4" />
      <rect x={52} y={40} width={10} height={10} rx={2} fill="#fed7aa" />
      <rect x={68} y={40} width={10} height={10} rx={2} fill="#99f6e4" />
      <rect x={36} y={56} width={10} height={10} rx={2} fill="#fed7aa" />
      <rect x={52} y={56} width={10} height={10} rx={2} fill="#99f6e4" />
      <circle cx={88} cy={72} r={22} fill="#fff7ed" stroke="#f97316" strokeWidth={2.5} />
      <circle cx={88} cy={72} r={2.5} fill="#f97316" />
      <path
        d="M88 72V62"
        stroke="#f97316"
        strokeWidth={2.5}
        strokeLinecap="round"
      />
      <path
        d="M88 72l6 4"
        stroke="#f97316"
        strokeWidth={2.5}
        strokeLinecap="round"
      />
    </svg>
  );
}
