import type { SVGProps } from 'react'

type P = SVGProps<SVGSVGElement>
const base = (p: P) => ({
  width: 22,
  height: 22,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2.4,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  ...p,
})

export const IconInfo = (p: P) => (
  <svg {...base(p)}>
    <circle cx="12" cy="12" r="9" />
    <line x1="12" y1="11" x2="12" y2="16" />
    <circle cx="12" cy="7.5" r="0.6" fill="currentColor" stroke="none" />
  </svg>
)

export const IconShare = (p: P) => (
  <svg {...base(p)}>
    <circle cx="18" cy="5" r="2.6" />
    <circle cx="6" cy="12" r="2.6" />
    <circle cx="18" cy="19" r="2.6" />
    <line x1="8.3" y1="10.8" x2="15.7" y2="6.2" />
    <line x1="8.3" y1="13.2" x2="15.7" y2="17.8" />
  </svg>
)

export const IconStar = (p: P) => (
  <svg {...base(p)}>
    <polygon points="12 3 14.6 8.6 20.7 9.3 16.2 13.5 17.5 19.5 12 16.4 6.5 19.5 7.8 13.5 3.3 9.3 9.4 8.6" />
  </svg>
)

export const IconPlay = (p: P) => (
  <svg {...base(p)} fill="currentColor" stroke="none">
    <polygon points="7 5 19 12 7 19" />
  </svg>
)

export const IconGear = (p: P) => (
  <svg {...base(p)}>
    <circle cx="12" cy="12" r="3.2" />
    <path d="M12 2.5v2.4M12 19.1v2.4M4.2 4.2l1.7 1.7M18.1 18.1l1.7 1.7M2.5 12h2.4M19.1 12h2.4M4.2 19.8l1.7-1.7M18.1 5.9l1.7-1.7" />
  </svg>
)

export const IconCheck = (p: P) => (
  <svg {...base(p)}>
    <polyline points="4 12.5 9.5 18 20 6" />
  </svg>
)

export const IconClose = (p: P) => (
  <svg {...base(p)}>
    <line x1="6" y1="6" x2="18" y2="18" />
    <line x1="18" y1="6" x2="6" y2="18" />
  </svg>
)

export const IconRefresh = (p: P) => (
  <svg {...base(p)} stroke="#2b3642">
    <path d="M20 11a8 8 0 1 0-1.2 5.3" />
    <polyline points="20 4 20 11 13 11" />
  </svg>
)

export const IconEyeOff = (p: P) => (
  <svg {...base(p)}>
    <path d="M3 3l18 18" />
    <path d="M10.6 6.3A9.7 9.7 0 0 1 12 6.2c5 0 9 5.8 9 5.8a17 17 0 0 1-3 3.3M6.2 7.7A17.3 17.3 0 0 0 3 12s4 5.8 9 5.8a9 9 0 0 0 3.4-.66" />
    <path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" />
  </svg>
)

export const IconEye = (p: P) => (
  <svg {...base(p)}>
    <path d="M3 12s4-5.8 9-5.8S21 12 21 12s-4 5.8-9 5.8S3 12 3 12z" />
    <circle cx="12" cy="12" r="2.7" />
  </svg>
)

/** Logo : deux guillemets stylisés qui se superposent (rose/bleu, les deux équipes) —
 * le mot qu'on se dit à l'oral, sans bulle ni ornement superflu. */
export const Logo = (p: P) => (
  <svg viewBox="0 0 120 120" {...p}>
    <g transform="translate(12 0)">
      <path
        fill="#E12F72"
        d="M30 26 C52 26 61 44 56 62 C53 75 41 82 27 79 C34 68 34 57 25 52 C16 47 14 34 21 27 C24 24 27 25 30 26 Z"
      />
      <path
        fill="#2E86F5"
        transform="translate(-24 0)"
        d="M74 26 C96 26 105 44 100 62 C97 75 85 82 71 79 C78 68 78 57 69 52 C60 47 58 34 65 27 C68 24 71 25 74 26 Z"
      />
    </g>
  </svg>
)
