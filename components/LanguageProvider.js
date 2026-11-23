'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { LANGS, LANG_COOKIE, DEFAULT_LANG, normalizeLang, translate } from '@/lib/i18n';

const LanguageContext = createContext({ lang: DEFAULT_LANG, setLang: () => {}, t: (text, vars) => translate(DEFAULT_LANG, text, vars) });

/** Holds the site language (initial value read from the cookie by app/layout.js). */
export function LanguageProvider({ initialLang = DEFAULT_LANG, children }) {
  const router = useRouter();
  const [lang, setLangState] = useState(normalizeLang(initialLang));

  useEffect(() => {
    document.documentElement.lang = LANGS.find((l) => l.code === lang)?.htmlLang || 'en';
  }, [lang]);

  const setLang = useCallback((next) => {
    const code = normalizeLang(next);
    document.cookie = `${LANG_COOKIE}=${code}; path=/; max-age=31536000; samesite=lax`;
    setLangState(code);
    router.refresh(); // server-rendered pages re-render in the new language
  }, [router]);

  const value = useMemo(() => ({ lang, setLang, t: (text, vars) => translate(lang, text, vars) }), [lang, setLang]);
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export const useLanguage = () => useContext(LanguageContext);

/** t(text, vars) in client components. */
export const useT = () => useContext(LanguageContext).t;

/** <T>English text</T> or <T vars={{ n: 3 }}>{'{n} answers'}</T>: usable from server components too. */
export function T({ children, vars }) {
  const t = useT();
  return <>{t(String(children), vars)}</>;
}
