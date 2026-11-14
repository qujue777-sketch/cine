/** 统一的线条图标集，全部继承 currentColor，尺寸由 CSS 控制 */
const base = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
};

export const IconSearch = (props) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" {...base} {...props}>
    <circle cx="11" cy="11" r="6.5" />
    <path d="M16 16l4 4" />
  </svg>
);

export const IconBookmark = ({ filled = false, ...props }) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" {...base} fill={filled ? 'currentColor' : 'none'} {...props}>
    <path d="M6.5 4.5h11a1 1 0 011 1v14.2l-6.5-4.2-6.5 4.2V5.5a1 1 0 011-1z" />
  </svg>
);

export const IconSun = (props) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" {...base} {...props}>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.2 5.2l1.4 1.4M17.4 17.4l1.4 1.4M18.8 5.2l-1.4 1.4M6.6 17.4l-1.4 1.4" />
  </svg>
);

export const IconMoon = (props) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" {...base} {...props}>
    <path d="M20 14.2A8.2 8.2 0 019.8 4a8.5 8.5 0 1010.2 10.2z" />
  </svg>
);

export const IconArrowRight = (props) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" {...base} {...props}>
    <path d="M4.5 12h15M14 6.5l5.5 5.5L14 17.5" />
  </svg>
);

export const IconChevronLeft = (props) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" {...base} {...props}>
    <path d="M14.5 5.5L8 12l6.5 6.5" />
  </svg>
);

export const IconChevronRight = (props) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" {...base} {...props}>
    <path d="M9.5 5.5L16 12l-6.5 6.5" />
  </svg>
);

export const IconChevronDown = (props) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" {...base} {...props}>
    <path d="M6 9.5l6 6 6-6" />
  </svg>
);

export const IconClose = (props) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" {...base} {...props}>
    <path d="M6 6l12 12M18 6L6 18" />
  </svg>
);

export const IconCheck = (props) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" {...base} {...props}>
    <path d="M5 12.5l4.5 4.5L19 7.5" />
  </svg>
);

export const IconEye = (props) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" {...base} {...props}>
    <path d="M2.5 12S6 5.8 12 5.8 21.5 12 21.5 12 18 18.2 12 18.2 2.5 12 2.5 12z" />
    <circle cx="12" cy="12" r="2.8" />
  </svg>
);

export const IconMenu = (props) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" {...base} {...props}>
    <path d="M4 7.5h16M4 12h16M4 16.5h16" />
  </svg>
);

export const IconStar = ({ filled = true, ...props }) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
    <path
      d="M12 4.4l2.35 4.9 5.15.72-3.75 3.68.9 5.2L12 16.4l-4.65 2.5.9-5.2L4.5 10.02l5.15-.72z"
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinejoin="round"
    />
  </svg>
);

export const IconFilm = (props) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" {...base} {...props}>
    <rect x="3.2" y="4.5" width="17.6" height="15" rx="2.2" />
    <path d="M8 4.5v15M16 4.5v15M3.2 9.5h4.8M16 9.5h4.8M3.2 14.5h4.8M16 14.5h4.8" />
  </svg>
);
