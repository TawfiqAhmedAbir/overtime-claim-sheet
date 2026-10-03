interface IconProps {
  size?: number;
  className?: string;
}

export function ClockIcon({ size = 24, className }: IconProps) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm0 1.5a8.5 8.5 0 1 1 0 17 8.5 8.5 0 0 1 0-17Zm-.75 4.25a.75.75 0 0 1 1.5 0v4.19l2.72 1.57a.75.75 0 1 1-.75 1.3l-3.09-1.78A.75.75 0 0 1 11.25 12V7.75Z"
      />
    </svg>
  );
}

export function CalendarIcon({ size = 24, className }: IconProps) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M7 2a1 1 0 0 1 1 1v1h8V3a1 1 0 1 1 2 0v1h1.5A2.5 2.5 0 0 1 22 6.5v13A2.5 2.5 0 0 1 19.5 22h-15A2.5 2.5 0 0 1 2 19.5v-13A2.5 2.5 0 0 1 4.5 4H6V3a1 1 0 0 1 1-1Zm12.5 6.5h-15v11a1 1 0 0 0 1 1h13a1 1 0 0 0 1-1v-11ZM8 11a1 1 0 1 0 0 2h1a1 1 0 1 0 0-2H8Zm4 0a1 1 0 1 0 0 2h1a1 1 0 1 0 0-2h-1Zm4 0a1 1 0 1 0 0 2h1a1 1 0 1 0 0-2h-1Z" />
    </svg>
  );
}

export function DownloadIcon({ size = 24, className }: IconProps) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 3a1 1 0 0 1 1 1v9.59l2.3-2.3a1 1 0 1 1 1.4 1.42l-4 4a1 1 0 0 1-1.4 0l-4-4a1 1 0 1 1 1.4-1.42L11 13.59V4a1 1 0 0 1 1-1Zm-7 14a1 1 0 1 0 0 2h14a1 1 0 1 0 0-2H5Z" />
    </svg>
  );
}

export function SettingsIcon({ size = 24, className }: IconProps) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M10.3 2.5a1.75 1.75 0 0 1 3.4 0l.22 1.05a7.04 7.04 0 0 1 1.74.99l1.02-.38a1.75 1.75 0 0 1 2.2 2.2l-.38 1.02c.42.52.76 1.1.99 1.74l1.05.22a1.75 1.75 0 0 1 0 3.4l-1.05.22c-.23.64-.57 1.22-.99 1.74l.38 1.02a1.75 1.75 0 0 1-2.2 2.2l-1.02-.38c-.54.42-1.12.76-1.74.99l-.22 1.05a1.75 1.75 0 0 1-3.4 0l-.22-1.05a7.04 7.04 0 0 1-1.74-.99l-1.02.38a1.75 1.75 0 0 1-2.2-2.2l.38-1.02a7.04 7.04 0 0 1-.99-1.74l-1.05-.22a1.75 1.75 0 0 1 0-3.4l1.05-.22c.23-.64.57-1.22.99-1.74l-.38-1.02a1.75 1.75 0 0 1 2.2-2.2l1.02.38c.54-.42 1.12-.76 1.74-.99l.22-1.05ZM12 9.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5Z"
      />
    </svg>
  );
}

export function PlusIcon({ size = 24, className }: IconProps) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M11 5a1 1 0 1 1 2 0v5h5a1 1 0 1 1 0 2h-5v5a1 1 0 1 1-2 0v-5H6a1 1 0 1 1 0-2h5V5Z" />
    </svg>
  );
}

export function RepeatIcon({ size = 24, className }: IconProps) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M5.5 7A4.5 4.5 0 0 1 10 2.5h6.5a1 1 0 1 1 0 2H10A2.5 2.5 0 0 0 7.5 7v1.5a1 1 0 1 1-2 0V7Zm13 10a4.5 4.5 0 0 1-4.5 4.5H8.5a1 1 0 1 1 0-2H14a2.5 2.5 0 0 0 2.5-2.5V15a1 1 0 1 1 2 0v2ZM4.5 9a1 1 0 0 1 1 1v2.5A4.5 4.5 0 0 0 10 17h6.5a1 1 0 1 1 0 2H10A6.5 6.5 0 0 1 3.5 12.5V10a1 1 0 0 1 1-1Zm15-1.5a1 1 0 0 1 1 1V12A6.5 6.5 0 0 1 14 18.5H7.5a1 1 0 1 1 0-2H14a4.5 4.5 0 0 0 4.5-4.5V8.5a1 1 0 0 1 1-1Z" />
    </svg>
  );
}

export function ClipboardIcon({ size = 48, className }: IconProps) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M8 2a2 2 0 0 0-2 2v1H5.5A2.5 2.5 0 0 0 3 7.5v12A2.5 2.5 0 0 0 5.5 22h13a2.5 2.5 0 0 0 2.5-2.5v-12A2.5 2.5 0 0 0 18.5 5H18V4a2 2 0 0 0-2-2H8Zm0 2h8v1H8V4ZM5.5 7H18.5a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1h-13a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1ZM8 10a1 1 0 0 0 0 2h8a1 1 0 1 0 0-2H8Zm0 4a1 1 0 1 0 0 2h5a1 1 0 1 0 0-2H8Z" />
    </svg>
  );
}

export function ChevronLeftIcon({ size = 20, className }: IconProps) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M14.53 5.47a.75.75 0 0 1 0 1.06L10.06 11l4.47 4.47a.75.75 0 1 1-1.06 1.06l-5-5a.75.75 0 0 1 0-1.06l5-5a.75.75 0 0 1 1.06 0Z" />
    </svg>
  );
}

export function ChevronRightIcon({ size = 20, className }: IconProps) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M9.47 5.47a.75.75 0 0 1 1.06 0l5 5a.75.75 0 0 1 0 1.06l-5 5a.75.75 0 0 1-1.06-1.06L13.94 11 9.47 6.53a.75.75 0 0 1 0-1.06Z" />
    </svg>
  );
}
