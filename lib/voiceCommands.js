/**
 * Short spoken follow-ups the voice tutor understands after an answer, in Hinglish, Hindi or English.
 * Only short phrases count (a real question that happens to contain "example" is sent as a question).
 */
const MAX_COMMAND_WORDS = 6;

const COMMANDS = [
  // "samajh gaya" first: "samajh gaya, aage batao" means understood.
  { id: 'understood', re: /(samajh?|samjh?)\s*(gaya|gayi|gya|gyi|aa\s*gaya|aa\s*gya|liya)|\bgot it\b|\bunderstood\b|\bclear (hai|ho gaya)\b|समझ\s*(गया|गई|आ\s*गया|लिया)/i },
  { id: 'repeat', re: /\b(phir|fir)\s*se\b|\bdobara\b|\brepeat\b|\bagain\b|फिर\s*से|दोबारा/i },
  { id: 'simpler', re: /\b(simple|simpler|aasan|asan|easy|easier)\b|आसान|सरल/i },
  { id: 'example', re: /\b(example|udaharan|udahran)\b|उदाहरण/i },
  { id: 'next', re: /\b(aage|age|next|agla|continue)\b|आगे|अगला/i },
];

// Polite or filler words that may surround a command ("bhaiya aur simple karo please").
const FILLER = new Set(('batao bataiye bata bolo boliye karo kariye kar do dijiye de please plz pls bhaiya bhai sir mam maam ' +
  'ji ek aur or and ok okay haan ha hai ho se me mein explain samjhao samjhaiye samjha it this isko ise ye yeh step more one ' +
  'an a the give tell main mai bas thoda zara बताओ बताइए करो दो दीजिए और थोड़ा एक समझाओ भैया जी इसे ये है हो गया').split(' '));

/** The command in a spoken phrase ('understood' | 'repeat' | 'simpler' | 'example' | 'next'), or null. */
export function detectVoiceCommand(text) {
  const t = String(text || '').toLowerCase().replace(/[.,!?।]/g, ' ').trim();
  if (!t || t.split(/\s+/).length > MAX_COMMAND_WORDS) return null;
  const cmd = COMMANDS.find((c) => c.re.test(t));
  if (!cmd) return null;
  // Only a command when nothing real is left besides it ("next prime number kya hai" is a question).
  const rest = t.replace(cmd.re, ' ').split(/\s+/).filter((w) => w && !FILLER.has(w));
  return rest.length <= 1 ? cmd.id : null;
}

/** What each command sends to the tutor (repeat is handled on the device and sends nothing). */
export const COMMAND_REQUESTS = {
  simpler: { text: 'Isko aur simple tarike se samjhao.', mode: 'Simple' },
  example: { text: 'Ek aur example do, alag tarah ka.', mode: null },
  next: { text: 'Aage batao, next step.', mode: null },
  understood: { text: 'Samajh gaya. Check karne ke liye ek chhota sa sawaal pucho.', mode: 'Check Question' },
};

/** Tap-able versions of the same commands, shown under the latest answer. */
export const COMMAND_CHIPS = [
  { id: 'repeat', label: 'Phir se batao' },
  { id: 'simpler', label: 'Aur simple' },
  { id: 'example', label: 'Example do' },
  { id: 'next', label: 'Aage batao' },
  { id: 'understood', label: 'Samajh gaya' },
];

/** Numbers in a transcript, to repeat back before solving ("Aapne 8 aur 5 bola, sahi?"). */
export function numbersIn(text) {
  return (String(text || '').match(/\d+(?:[.,]\d+)?/g) || []).slice(0, 6);
}
