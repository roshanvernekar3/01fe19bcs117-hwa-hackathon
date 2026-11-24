import type { SVGProps } from "react";

export type IconName =
  | "menu"
  | "close"
  | "bag"
  | "heart"
  | "user"
  | "arrow-right"
  | "arrow-up-right"
  | "arrow-down"
  | "plus"
  | "minus"
  | "sparkle"
  | "leaf"
  | "recycle"
  | "scan"
  | "check"
  | "search"
  | "chevron-down"
  | "shield"
  | "mail"
  | "globe"
  | "truck"
  | "rotate"
  | "star"
  | "trash"
  | "filter"
  | "play";

const paths: Record<IconName, React.ReactNode> = {
  menu: (
    <>
      <path d="M3 7h18M3 12h18M3 17h18" />
    </>
  ),
  close: <path d="M5 5l14 14M19 5L5 19" />,
  bag: (
    <>
      <path d="M5.5 8h13l-1 12h-11l-1-12Z" />
      <path d="M9 8V6.5a3 3 0 0 1 6 0V8" />
    </>
  ),
  heart: (
    <path d="M12 20s-7.5-4.6-7.5-10A4.5 4.5 0 0 1 12 6.6 4.5 4.5 0 0 1 19.5 10c0 5.4-7.5 10-7.5 10Z" />
  ),
  user: (
    <>
      <circle cx="12" cy="8" r="3.5" />
      <path d="M4.5 20a7.5 7.5 0 0 1 15 0" />
    </>
  ),
  "arrow-right": (
    <>
      <path d="M4 12h16" />
      <path d="M14 6l6 6-6 6" />
    </>
  ),
  "arrow-up-right": (
    <>
      <path d="M7 17 17 7" />
      <path d="M8 7h9v9" />
    </>
  ),
  "arrow-down": (
    <>
      <path d="M12 4v16" />
      <path d="M6 14l6 6 6-6" />
    </>
  ),
  plus: <path d="M12 5v14M5 12h14" />,
  minus: <path d="M5 12h14" />,
  sparkle: (
    <>
      <path d="M12 3l1.7 5.3L19 10l-5.3 1.7L12 17l-1.7-5.3L5 10l5.3-1.7L12 3Z" />
      <path d="M18.5 15.5l.8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2L15.5 19l2.2-.8.8-2.2Z" />
    </>
  ),
  leaf: (
    <>
      <path d="M20 4C11 4 5 8 5 15c0 2.5 2 5 5 5 7 0 10-6 10-16Z" />
      <path d="M4 21c2-6 6-9 11-11" />
    </>
  ),
  recycle: (
    <>
      <path d="M7.4 8.2 9.9 4l2.5 4.2" />
      <path d="M4.8 14.4 7.4 10h4.9" />
      <path d="M16.2 10h5.1l-2.5 4.3" />
      <path d="M19.2 15.8 16.7 20h-5" />
      <path d="M9.4 20H4.3l2.5-4.3" />
    </>
  ),
  scan: (
    <>
      <path d="M3 8V5a2 2 0 0 1 2-2h3M16 3h3a2 2 0 0 1 2 2v3M21 16v3a2 2 0 0 1-2 2h-3M8 21H5a2 2 0 0 1-2-2v-3" />
      <path d="M3 12h18" />
    </>
  ),
  check: <path d="M4 12.5 9 17.5 20 6.5" />,
  search: (
    <>
      <circle cx="11" cy="11" r="6.5" />
      <path d="m16 16 4.5 4.5" />
    </>
  ),
  "chevron-down": <path d="m6 9 6 6 6-6" />,
  shield: (
    <>
      <path d="M12 3 20 6v5c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V6l8-3Z" />
      <path d="m8.5 12 2.5 2.5 4.5-5" />
    </>
  ),
  mail: (
    <>
      <rect x="3" y="5.5" width="18" height="13" rx="2" />
      <path d="m3.5 7 8.5 6 8.5-6" />
    </>
  ),
  globe: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c2.5 2.5 3.5 5.5 3.5 9s-1 6.5-3.5 9c-2.5-2.5-3.5-5.5-3.5-9S9.5 5.5 12 3Z" />
    </>
  ),
  truck: (
    <>
      <path d="M3 6h11v10H3zM14 9h4l3 3v4h-7z" />
      <circle cx="7" cy="18" r="1.6" />
      <circle cx="17.5" cy="18" r="1.6" />
    </>
  ),
  rotate: (
    <>
      <path d="M20 8a8 8 0 1 1-2.3-2.3" />
      <path d="M20 3v5h-5" />
    </>
  ),
  star: <path d="m12 3 2.6 5.6 6.2.8-4.5 4.3 1.1 6.1-5.4-3-5.4 3 1.1-6.1L3.2 9.4l6.2-.8L12 3Z" />,
  trash: (
    <>
      <path d="M4 7h16M9 7V5h6v2M6 7l1 13h10l1-13" />
      <path d="M10 11v5M14 11v5" />
    </>
  ),
  filter: <path d="M4 6h16M7 12h10M10 18h4" />,
  play: <path d="M8 5v14l11-7-11-7Z" />,
};

export default function Icon({
  name,
  size = 20,
  strokeWidth = 1.5,
  ...rest
}: { name: IconName; size?: number; strokeWidth?: number } & SVGProps<SVGSVGElement>) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...rest}
    >
      {paths[name]}
    </svg>
  );
}
