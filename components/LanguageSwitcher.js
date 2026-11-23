'use client';

import { useEffect, useRef, useState } from 'react';
import { Languages, Check } from 'lucide-react';
import { LANGS } from '@/lib/i18n';
import { useLanguage } from './LanguageProvider';

/** Navbar language menu: English / Hinglish / हिन्दी (saved in a cookie). */
export default function LanguageSwitcher({ buttonClass }) {
  const { lang, setLang, t } = useLanguage();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const current = LANGS.find((l) => l.code === lang) || LANGS[0];

  useEffect(() => {
    if (!open) return undefined;
    const onDown = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('mousedown', onDown); document.removeEventListener('keydown', onKey); };
  }, [open]);

  return (
    <div className="relative shrink-0" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={t('Language')}
        title={t('Language')}
        className={`${buttonClass} gap-1 sm:w-auto sm:px-3`}
      >
        {/* Phones: just the selected language inside the round button; larger screens add the icon. */}
        <Languages className="hidden h-5 w-5 sm:block" />
        <span className="text-[10px] font-bold leading-none sm:text-sm">{current.short}</span>
      </button>
      {open && (
        <div role="menu" className="absolute right-0 top-11 z-50 w-44 rounded-lg bg-surface-50 p-1.5 shadow-menu animate-fade-in sm:top-12">
          {LANGS.map((l) => (
            <button
              key={l.code}
              type="button"
              role="menuitemradio"
              aria-checked={l.code === lang}
              onClick={() => { setOpen(false); if (l.code !== lang) setLang(l.code); }}
              className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm font-medium transition-colors hover:bg-surface-100 ${l.code === lang ? 'text-brand-600' : 'text-surface-900'}`}
            >
              {l.label}
              {l.code === lang && <Check className="h-4 w-4" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
