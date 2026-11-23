'use client';

/**
 * Read tutor answers aloud with the browser's own text-to-speech (free, works offline on most phones).
 * - Markdown, LaTeX, code and emoji are turned into plain speakable text first.
 * - Hindi (Devanagari) and Hinglish (Hindi in Latin letters) use a Hindi voice; plain English an Indian
 *   English voice. Natural/neural voices are preferred over old robotic system voices.
 * - Text is spoken in short chunks because Chrome silently stops long utterances after ~15 seconds.
 * - One answer speaks at a time; components read which one with useSpeakingId().
 */
import { useSyncExternalStore } from 'react';

const MAX_CHUNK = 200;
const DEVANAGARI = /[ऀ-ॿ]/;
// Common Hindi words written in Latin letters: two or more in a sentence means it is Hinglish.
const HINGLISH_WORDS = /\b(hai|hain|ka|ki|ke|ko|se|mein|aur|nahi|nahin|kya|kaise|karo|karte|kar|ho|hota|hoti|yeh|ye|woh|wo|matlab|toh|bhi|jab|tab|agar|apna|apne|yahan|wahan|samajh|samjho|socho|dekho|bolo|batao|sawaal|jawab|koi|baat|liye|wala|wali|raha|rahi|gaya|gayi|chahiye|sakte|isko|usko|hum|aap|tum)\b/gi;
const isHindiLike = (text) => DEVANAGARI.test(text) || (String(text).match(HINGLISH_WORDS) || []).length >= 2;

let speakingId = null;
let run = 0;
let activeUtterance = null; // the chunk being spoken (see speak)
const listeners = new Set();
// Reading progress for word highlighting: { id, chunkIndex, chunk, charIndex } or null when stopped.
const progressListeners = new Set();
const emitProgress = (p) => progressListeners.forEach((l) => l(p));
export const onSpeechProgress = (l) => {
  progressListeners.add(l);
  return () => progressListeners.delete(l);
};
const setSpeaking = (id) => {
  speakingId = id;
  listeners.forEach((l) => l());
  if (id === null) emitProgress(null);
};
const subscribe = (l) => {
  listeners.add(l);
  return () => listeners.delete(l);
};

export const canSpeak = () => typeof window !== 'undefined' && 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window;

/** The id of the answer being read right now, or null. */
export const useSpeakingId = () => useSyncExternalStore(subscribe, () => speakingId, () => null);

// Simple LaTeX → words, enough for school maths ("a by b", "x squared", "square root of 2").
function mathToWords(m) {
  return String(m)
    .replace(/\\(?:d|t)?frac\{([^{}]+)\}\{([^{}]+)\}/g, ' $1 by $2 ')
    .replace(/\\sqrt\{([^{}]+)\}/g, ' square root of $1 ')
    .replace(/\^\{?2\}?/g, ' squared ')
    .replace(/\^\{?3\}?/g, ' cubed ')
    .replace(/\^\{([^{}]+)\}/g, ' to the power $1 ')
    .replace(/\^(\w)/g, ' to the power $1 ')
    .replace(/\\(?:times|cdot)/g, ' times ')
    .replace(/\\div/g, ' divided by ')
    .replace(/\\pm/g, ' plus or minus ')
    .replace(/\\(?:leq|le)\b/g, ' less than or equal to ')
    .replace(/\\(?:geq|ge)\b/g, ' greater than or equal to ')
    .replace(/\\(?:neq|ne)\b/g, ' not equal to ')
    .replace(/\\(?:approx)\b/g, ' approximately ')
    .replace(/\\(?:rightarrow|to|Rightarrow|implies)\b/g, ' gives ')
    .replace(/\\(?:text|mathrm|mathbf|operatorname)\{([^{}]*)\}/g, ' $1 ')
    .replace(/\\(?:left|right|quad|qquad|,|;|!)/g, ' ')
    .replace(/\\([a-zA-Z]+)/g, ' $1 ')
    .replace(/</g, ' less than ')
    .replace(/>/g, ' greater than ')
    .replace(/=/g, ' equals ')
    .replace(/[{}_\\]/g, ' ');
}

/** Markdown answer → plain text a voice can read. */
export function toSpeechText(markdown) {
  return String(markdown || '')
    .replace(/```[\s\S]*?```/g, '\n(The code is shown on screen.)\n')
    .replace(/\\\[([\s\S]+?)\\\]/g, (_, m) => `\n${mathToWords(m)}.\n`)
    .replace(/\\\(([\s\S]+?)\\\)/g, (_, m) => ` ${mathToWords(m)} `)
    .replace(/\$\$([\s\S]+?)\$\$/g, (_, m) => `\n${mathToWords(m)}.\n`)
    .replace(/\$([^$\n]+?)\$/g, (_, m) => ` ${mathToWords(m)} `)
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    // Spell out the initials so browser voices don't pronounce "AI" as "eye" or "I".
    .replace(/\bA\.?\s*I\.?\b/gi, 'A I')
    .replace(/^\s*\|?\s*:?-{2,}[-|:\s]*$/gm, '') // table divider rows
    .replace(/^[ \t]*\|(.*?)\|?[ \t]*$/gm, (_, row) => `${row.split('|').map((c) => c.trim()).filter(Boolean).join(', ')}.`) // table rows
    .replace(/^#{1,6}\s*/gm, '')
    .replace(/^\s*>\s?/gm, '')
    .replace(/^\s*[-*+]\s+/gm, '')
    .replace(/(\*\*|__|~~|\*)/g, '')
    .replace(/[\p{Extended_Pictographic}️‍]/gu, '')
    .replace(/[ \t]+/g, ' ')
    .replace(/\n\s*\n+/g, '\n')
    .trim();
}

// Sentences grouped into chunks of at most MAX_CHUNK characters.
function toChunks(text) {
  const pieces = text.split(/(?<=[.!?।])\s+|\n+/).map((s) => s.trim()).filter(Boolean);
  const chunks = [];
  for (const piece of pieces) {
    // A very long sentence is split at commas, then at spaces.
    const parts = piece.length <= MAX_CHUNK ? [piece] : piece.split(/(?<=[,;:])\s+/);
    for (let part of parts) {
      while (part.length > MAX_CHUNK) {
        const cut = part.lastIndexOf(' ', MAX_CHUNK) > 40 ? part.lastIndexOf(' ', MAX_CHUNK) : MAX_CHUNK;
        chunks.push(part.slice(0, cut));
        part = part.slice(cut).trim();
      }
      const last = chunks[chunks.length - 1];
      const sameScript = last && isHindiLike(last) === isHindiLike(part);
      if (last && sameScript && last.length + part.length + 1 <= MAX_CHUNK) chunks[chunks.length - 1] = `${last} ${part}`;
      else if (part) chunks.push(part);
    }
  }
  return chunks;
}

// How human a voice sounds, judged from its name. Neural "Natural"/"Online" voices (Edge, Windows 11)
// and Google's voices (Chrome, Android) are far clearer than old offline system voices such as
// "Microsoft Hemant", which sound robotic. (Some natural voices send no word-boundary events, so
// only the sentence is highlighted with them; clear speech matters more.)
function voiceQuality(v) {
  const name = v.name || '';
  if (/natural|neural|wavenet|premium|enhanced/i.test(name)) return 3;
  if (/online|google/i.test(name) || !v.localService) return 2;
  return 1;
}
// SpeechSynthesisVoice has no gender field; these common male names win when two voices are equally good.
const MALE = /\b(male|madhur|hemant|ravi|prabhat|aarav|kunal|aaron|david|mark|james|daniel|george|ryan|thomas)\b/i;

function pickVoice(hindi) {
  const voices = window.speechSynthesis.getVoices() || [];
  const lang = (v) => (v.lang || '').toLowerCase().replace('_', '-');
  const best = (list) => list.sort((a, b) =>
    voiceQuality(b) - voiceQuality(a) || Number(MALE.test(b.name || '')) - Number(MALE.test(a.name || '')))[0];
  if (hindi) return best(voices.filter((v) => lang(v).startsWith('hi')));
  return best(voices.filter((v) => lang(v) === 'en-in')) || best(voices.filter((v) => lang(v).startsWith('en')));
}

// Voices load asynchronously in Chrome; touching getVoices() early starts the load.
if (canSpeak()) {
  window.speechSynthesis.getVoices();
  window.speechSynthesis.addEventListener?.('voiceschanged', () => window.speechSynthesis.getVoices());
}

/** Stop whatever is being read. */
export function stopSpeaking() {
  run += 1;
  if (canSpeak()) window.speechSynthesis.cancel();
  if (speakingId !== null) setSpeaking(null);
}

/** Read an answer aloud. Returns false when the browser cannot speak or there is nothing to read. */
// opts.slow: read slower (the learner said "phir se batao").
export function speak(id, markdown, opts = {}) {
  if (!canSpeak()) return false;
  const chunks = toChunks(toSpeechText(markdown));
  if (!chunks.length) return false;

  const synth = window.speechSynthesis;
  synth.cancel();
  const token = ++run;
  setSpeaking(id);

  // Chunks are spoken one after another (the next starts on the previous one's end), not queued
  // all at once. Chrome otherwise garbage-collects queued utterances and then stops sending their
  // start/word/end events, which broke auto-read, highlighting and scrolling after the first answer.
  // A watchdog moves on if Chrome never fires "end" for a chunk.
  let watchdog = null;
  const speakChunk = (i) => {
    clearInterval(watchdog);
    if (run !== token) return;
    if (i >= chunks.length) { activeUtterance = null; setSpeaking(null); return; }
    const chunk = chunks[i];
    {
      const u = new SpeechSynthesisUtterance(chunk);
      // Hinglish goes to the Hindi voice too: Indian Hindi voices say "samajh" or "sawaal" and the
      // English words in between naturally, while English voices mangle the Hindi words.
      let hindi = isHindiLike(chunk);
      let voice = pickVoice(hindi);
      if (hindi && !voice) { hindi = false; voice = pickVoice(false); }
      u.lang = hindi ? 'hi-IN' : 'en-IN';
      if (voice) u.voice = voice;
      // Natural voices sound most human at their own pitch and close to normal speed.
      u.rate = (voice && voiceQuality(voice) >= 2 ? 0.98 : 0.92) * (opts.slow ? 0.82 : 1);
      u.pitch = 1;
      // Exact word: voices that send word-boundary events (Edge, Windows, most phones) give it directly.
      // Voices that send none (Chrome's Google voices) get a timed estimate instead: words are stepped
      // through at the voice's speaking pace, restarting at every chunk so the estimate never drifts far.
      const wordStarts = [...chunk.matchAll(/[\p{L}\p{N}\p{M}]+/gu)].map((m) => m.index);
      const charsPerSecond = (hindi ? 12 : 14) * u.rate;
      let realBoundary = false;
      let simTimer = null;
      let lastSim = -1;
      u.onstart = () => {
        if (run !== token) return;
        emitProgress({ id, chunkIndex: i, chunk, charIndex: -1 });
        const startedAt = performance.now();
        simTimer = setInterval(() => {
          if (run !== token || realBoundary || done) { clearInterval(simTimer); return; }
          const spokenChars = ((performance.now() - startedAt) / 1000) * charsPerSecond;
          const at = wordStarts.filter((s) => s <= spokenChars).pop();
          if (at !== undefined && at !== lastSim) {
            lastSim = at;
            emitProgress({ id, chunkIndex: i, chunk, charIndex: at });
          }
        }, 80);
      };
      u.onboundary = (e) => {
        if (run !== token || (e.name && e.name !== 'word')) return;
        realBoundary = true; // the voice reports words itself: stop estimating
        clearInterval(simTimer);
        emitProgress({ id, chunkIndex: i, chunk, charIndex: e.charIndex });
      };
      let done = false;
      const next = () => { if (!done) { done = true; clearInterval(simTimer); speakChunk(i + 1); } };
      u.onend = () => { if (run === token) next(); };
      u.onerror = (e) => {
        if (run !== token || e.error === 'interrupted' || e.error === 'canceled') return;
        next(); // skip a chunk the voice could not say instead of stopping the whole answer
      };
      activeUtterance = u; // keep a reference so its events keep firing
      synth.resume(); // Chrome sometimes leaves the engine paused after cancel()
      synth.speak(u);
      // Watchdog: nothing speaking or queued for 1.5 s in a row means "end" was lost.
      let idle = 0;
      watchdog = setInterval(() => {
        if (run !== token) { clearInterval(watchdog); return; }
        idle = !synth.speaking && !synth.pending ? idle + 1 : 0;
        if (idle >= 3) next();
      }, 500);
    }
  };
  // Chrome can drop an utterance spoken in the same tick as cancel(); wait a moment.
  setTimeout(() => speakChunk(0), 60);
  return true;
}
