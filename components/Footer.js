import Link from 'next/link';
import LogoMark from '@/components/LogoMark';

export const LEGAL_LINKS = [
  { href: '/about', label: 'About' },
  { href: '/terms', label: 'Terms' },
  { href: '/privacy', label: 'Privacy Policy' },
  { href: '/disclaimer', label: 'Disclaimer' },
  { href: '/contact', label: 'Contact' },
];


// Small "About · Terms · …" row, Facebook style. Used in the footer and the signed-in sidebar.
export function LegalLinks({ className = '' }) {
  return (
    <nav aria-label="Legal" className={`flex flex-wrap items-center gap-x-1 text-xs text-surface-500 ${className}`}>
      {LEGAL_LINKS.map((l) => (
        <span key={l.href} className="after:ml-1 after:content-['·'] last:after:content-none">
          <Link href={l.href} className="hover:underline">{l.label}</Link>
        </span>
      ))}
      <span className="w-full pt-0.5">© {new Date().getFullYear()} BoloPadho</span>
    </nav>
  );
}

export default function Footer() {
  return (
    <footer className="border-t border-surface-200 bg-surface-50">
      <div className="mx-auto flex max-w-page flex-col gap-3 p-3 lg:p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <LogoMark className="h-8 w-8" />
          <p className="text-sm text-surface-500">
            © {new Date().getFullYear()} <span className="font-semibold text-surface-900">BoloPadho</span> · Apne Tarike Se Padho
          </p>
        </div>
        <nav aria-label="Footer" className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-surface-500">
          {LEGAL_LINKS.map((l) => (
            <Link key={l.href} href={l.href} className="hover:text-surface-900 hover:underline">{l.label}</Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
