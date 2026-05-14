/** Inline mark: IC-style train silhouette with a small dog (curly tail) for brand use. */
export function TrainDogLogo({ className = 'w-9 h-9' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <rect x="4" y="14" width="26" height="12" rx="2" fill="white" />
      <rect x="6" y="16" width="5" height="4" rx="0.5" fill="#c7d2fe" />
      <rect x="13" y="16" width="5" height="4" rx="0.5" fill="#c7d2fe" />
      <rect x="20" y="16" width="6" height="4" rx="0.5" fill="#c7d2fe" />
      <rect x="28" y="17" width="10" height="10" rx="1.5" fill="white" />
      <path
        d="M30 22c-1.2 0-2.2.9-2.4 2.1-.1.5-.2 1-.4 1.4-.3.6-.9 1-1.6 1.1h-1.2c-.5 0-.9-.4-.9-.9 0-.3.2-.6.4-.7.2-.1.3-.3.4-.5.2-.4.3-.9.4-1.4.3-1.8 1.8-3.1 3.7-3.1z"
        fill="#ff5c0b"
      />
      <path
        d="M35 20.5c.8.3 1.3 1.1 1.2 2-.1.6-.5 1.1-1 1.3"
        stroke="#ff5c0b"
        strokeWidth="1.2"
        strokeLinecap="round"
        fill="none"
      />
      <circle cx="10" cy="28" r="2.2" fill="#1e293b" />
      <circle cx="22" cy="28" r="2.2" fill="#1e293b" />
      <rect x="2" y="18" width="4" height="8" rx="1" fill="#e2e8f0" />
    </svg>
  );
}
