import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

/**
 * Все стрелки и служебные символы страницы — SVG, а не текстовые глифы.
 * Текстовые «→», «↗», «+» на мобильных превращаются в эмодзи и ломают набор.
 */
function Glyph({ children, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      {children}
    </svg>
  );
}

export function IconArrowRight(props: IconProps) {
  return (
    <Glyph className="ui-icon" {...props}>
      <path d="M4 12h15" />
      <path d="m13 6 6 6-6 6" />
    </Glyph>
  );
}

export function IconArrowLeft(props: IconProps) {
  return (
    <Glyph className="ui-icon" {...props}>
      <path d="M20 12H5" />
      <path d="m11 6-6 6 6 6" />
    </Glyph>
  );
}

export function IconArrowUpRight(props: IconProps) {
  return (
    <Glyph className="ui-icon" {...props}>
      <path d="M7 17 17 7" />
      <path d="M8 7h9v9" />
    </Glyph>
  );
}

export function IconArrowDownRight(props: IconProps) {
  return (
    <Glyph className="ui-icon" {...props}>
      <path d="M7 7l10 10" />
      <path d="M17 8v9H8" />
    </Glyph>
  );
}

export function IconArrowUp(props: IconProps) {
  return (
    <Glyph className="ui-icon" {...props}>
      <path d="M12 20V5" />
      <path d="m6 11 6-6 6 6" />
    </Glyph>
  );
}

export function IconPlus(props: IconProps) {
  return (
    <Glyph className="ui-icon" {...props}>
      <path d="M12 5v14" />
      <path d="M5 12h14" />
    </Glyph>
  );
}

export function IconCheck(props: IconProps) {
  return (
    <Glyph className="ui-icon" strokeWidth="2" {...props}>
      <path d="m4 12.5 5 5L20 6.5" />
    </Glyph>
  );
}

/* Иконки процесса — по одной на этап, вместо однотипных плашек. */
export function IconInbox(props: IconProps) {
  return (
    <Glyph {...props}>
      <path d="M3 13h5l1.5 3h5L16 13h5" />
      <path d="M4.5 5.5h15l1.5 7.5v5.5a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V13z" />
    </Glyph>
  );
}

export function IconFilter(props: IconProps) {
  return (
    <Glyph {...props}>
      <path d="M3.5 5h17l-6.5 8v6l-4 2v-8z" />
    </Glyph>
  );
}

export function IconBranch(props: IconProps) {
  return (
    <Glyph {...props}>
      <circle cx="6" cy="6" r="2.4" />
      <circle cx="18" cy="18" r="2.4" />
      <circle cx="6" cy="18" r="2.4" />
      <path d="M6 8.4v7.2" />
      <path d="M8.4 6H13a3 3 0 0 1 3 3v6.6" />
    </Glyph>
  );
}

export function IconPerson(props: IconProps) {
  return (
    <Glyph {...props}>
      <circle cx="12" cy="8" r="3.4" />
      <path d="M4.5 20a7.5 7.5 0 0 1 15 0" />
    </Glyph>
  );
}

export function IconDocument(props: IconProps) {
  return (
    <Glyph {...props}>
      <path d="M6 3h8l4 4v14H6z" />
      <path d="M14 3v4h4" />
      <path d="M9 12h6M9 16h6" />
    </Glyph>
  );
}

export function IconChart(props: IconProps) {
  return (
    <Glyph {...props}>
      <path d="M4 20h16" />
      <path d="M7 20V11" />
      <path d="M12 20V5" />
      <path d="M17 20v-6" />
    </Glyph>
  );
}

/* Иконки для систем без собственного логотипа. */
export function IconGlobe(props: IconProps) {
  return (
    <Glyph {...props}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M3.5 12h17" />
      <path d="M12 3.5c2.2 2.4 3.3 5.3 3.3 8.5s-1.1 6.1-3.3 8.5c-2.2-2.4-3.3-5.3-3.3-8.5s1.1-6.1 3.3-8.5z" />
    </Glyph>
  );
}

export function IconCard(props: IconProps) {
  return (
    <Glyph {...props}>
      <rect x="2.8" y="5.5" width="18.4" height="13" rx="2.2" />
      <path d="M2.8 10h18.4" />
      <path d="M6.5 14.5h3.5" />
    </Glyph>
  );
}

export function IconApi(props: IconProps) {
  return (
    <Glyph {...props}>
      <path d="M9 5.5 4.5 12 9 18.5" />
      <path d="M15 5.5 19.5 12 15 18.5" />
      <path d="m13.4 5-2.8 14" />
    </Glyph>
  );
}

export function IconCrm(props: IconProps) {
  return (
    <Glyph {...props}>
      <rect x="3.2" y="4.2" width="17.6" height="15.6" rx="2.4" />
      <path d="M3.2 9h17.6" />
      <path d="M9 9v10.8" />
      <path d="M12.5 13h5M12.5 16h3" />
    </Glyph>
  );
}
