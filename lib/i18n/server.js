import { cookies } from 'next/headers';
import { LANG_COOKIE, normalizeLang, translate } from './index';

/** The visitor's language from the cookie (server components and route handlers). */
export function getLang() {
  return normalizeLang(cookies().get(LANG_COOKIE)?.value);
}

/** t(text, vars) for server components. */
export function getT() {
  const lang = getLang();
  return (text, vars) => translate(lang, text, vars);
}
