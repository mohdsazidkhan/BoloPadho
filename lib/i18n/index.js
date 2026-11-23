/**
 * Site languages: English (source text), Hinglish and Hindi.
 * Same approach as SubgQuiz: the English text itself is the key; hi.js / hinglish.js map it to the
 * translation, and anything missing falls back to English. {name}-style placeholders are filled from vars.
 *
 * The choice is kept in the LANG_COOKIE cookie so server-rendered pages use it too:
 * - client components: const t = useT();   or <T>English text</T>   (components/LanguageProvider.js)
 * - server components: const t = getT();                            (lib/i18n/server.js)
 */
import HI from './hi';
import HINGLISH from './hinglish';
import EN from './en';
import { LEGAL_HI, LEGAL_HINGLISH } from './legal';

export const LANGS = [
  { code: 'en', label: 'English', short: 'EN', htmlLang: 'en' },
  { code: 'hinglish', label: 'Hinglish', short: 'HiEn', htmlLang: 'hi-Latn' },
  { code: 'hi', label: 'हिन्दी', short: 'हिं', htmlLang: 'hi' },
];
export const LANG_COOKIE = 'bolopadho-lang';
export const DEFAULT_LANG = 'hinglish'; // first visit, before the visitor picks a language

// en.js only holds English for source texts that are written in Hinglish ("Maine suna:").
const DICTIONARIES = { en: EN, hi: { ...LEGAL_HI, ...HI }, hinglish: { ...LEGAL_HINGLISH, ...HINGLISH } };

export const normalizeLang = (value) => (LANGS.some((l) => l.code === value) ? value : DEFAULT_LANG);

export function translate(lang, text, vars) {
  let out = (typeof text === 'string' && DICTIONARIES[lang]?.[text]) || text;
  if (vars && typeof out === 'string') {
    out = out.replace(/\{(\w+)\}/g, (match, key) => (vars[key] === undefined ? match : String(vars[key])));
  }
  return out;
}
