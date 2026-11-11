interface LogoMarkProps {
  readonly className?: string;
}

/**
 * GlobalHire Calc logo mark: a globe with rising cost bars and a cross-border orbit.
 * Same artwork as public/brand/logo-mark.svg and app/icon.svg.
 */
export function LogoMark({ className = 'size-9' }: LogoMarkProps) {
  return (
    <svg viewBox="0 0 96 96" className={className} aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="ghc-logo-bg" x1="8" y1="4" x2="92" y2="94" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#3b5bff" />
          <stop offset="0.55" stopColor="#2553eb" />
          <stop offset="1" stopColor="#0891b2" />
        </linearGradient>
        <radialGradient id="ghc-logo-shine" cx="22" cy="14" r="62" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.28" />
          <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="ghc-logo-orbit" x1="13" y1="76" x2="82" y2="34" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#fde68a" stopOpacity="0.15" />
          <stop offset="1" stopColor="#fbbf24" />
        </linearGradient>
        <clipPath id="ghc-logo-globe">
          <circle cx="46" cy="50" r="23" />
        </clipPath>
      </defs>
      <rect width="96" height="96" rx="24" fill="url(#ghc-logo-bg)" />
      <rect width="96" height="96" rx="24" fill="url(#ghc-logo-shine)" />
      <path
        d="M13 73 C 42 93, 80 81, 81 36"
        fill="none"
        stroke="url(#ghc-logo-orbit)"
        strokeWidth="5"
        strokeLinecap="round"
      />
      <circle cx="46" cy="50" r="23" fill="#ffffff" fillOpacity="0.1" stroke="#ffffff" strokeWidth="4.5" />
      <ellipse cx="46" cy="50" rx="10" ry="23" fill="none" stroke="#ffffff" strokeOpacity="0.5" strokeWidth="3" />
      <line x1="23" y1="44" x2="69" y2="44" stroke="#ffffff" strokeOpacity="0.5" strokeWidth="3" />
      <g clipPath="url(#ghc-logo-globe)" fill="#ffffff">
        <rect x="33" y="58" width="7" height="20" rx="2" />
        <rect x="43" y="51" width="7" height="27" rx="2" />
        <rect x="53" y="42" width="7" height="36" rx="2" />
      </g>
      <circle cx="81" cy="29" r="7" fill="#fbbf24" stroke="#ffffff" strokeWidth="3" />
    </svg>
  );
}
