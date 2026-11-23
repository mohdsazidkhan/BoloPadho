/**
 * Bolo Padho logo mark: a speech bubble ("Bolo") holding an open book ("Padho") on the brand circle.
 * Colours come from the theme tokens; size it with className (e.g. "h-10 w-10").
 * app/icon.svg is the same drawing with fixed colours for the browser tab.
 */
export default function LogoMark({ className = 'h-10 w-10', title }) {
  return (
    <svg
      viewBox="0 0 64 64"
      className={`shrink-0 ${className}`}
      role={title ? 'img' : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      <circle cx="32" cy="32" r="32" style={{ fill: 'rgb(var(--brand-500))' }} />
      <path d="M18 14h28a8 8 0 0 1 8 8v15a8 8 0 0 1-8 8H31l-10 8v-8h-3a8 8 0 0 1-8-8V22a8 8 0 0 1 8-8z" fill="#fff" />
      <path d="M19.5 23.5c4-2.2 8.2-2.2 11.5 0v15c-3.3-2.2-7.5-2.2-11.5 0z" style={{ fill: 'rgb(var(--brand-500))' }} />
      <path d="M33 23.5c3.3-2.2 7.5-2.2 11.5 0v15c-4-2.2-8.2-2.2-11.5 0z" style={{ fill: 'rgb(var(--brand-500))' }} />
    </svg>
  );
}
