# BoloPadho — Apne Tarike Se Padho

A voice-first AI study tutor for students in India. Speak your doubt in Hindi, English or Hinglish,
listen to a step-by-step answer, and check that you really understood. Built for **Scaler × Wispr
Flow "Build for Bharat"**, theme **Inclusive education**.

**Live:** <https://bolopadho.vercel.app> · **Pitch deck:** [docs/BoloPadho-Pitch-Deck.pdf](docs/BoloPadho-Pitch-Deck.pdf)

Many students in small towns can say a doubt in five seconds but need minutes to type it, especially
in Hindi, and usually there is nobody to ask at night. BoloPadho lets them simply speak.

## Run it (one command)

Requires Docker.

```bash
docker compose up --build
```

Open <http://localhost:3000>, sign up (any email works) and open **AI Tutor**.

This starts the app and its own MongoDB. **No secret keys are needed to start.** Everything except
the AI answers works without keys: sign up, dashboard, voice input, read-aloud, the three languages.
Without an AI key, the tutor replies with a clear "AI key not set" message.

To get real AI answers, create a `.env` file next to `docker-compose.yml` (copy `.env.example`) and
set `OPENROUTER_API_KEY` (free models work, <https://openrouter.ai/keys>), then run the command again.

### Without Docker

```bash
cp .env.example .env   # set MONGODB_URI, JWT_SECRET and optionally OPENROUTER_API_KEY
npm ci
npm run dev            # http://localhost:3000
```

## The core voice flow

1. **Speak.** Tap the mic and ask in your own words, e.g. *"Bhaiya, triangle ka area wala sawaal
   samajh nahi aaya, base 8 height 5."* Speech-to-text runs in the browser (Hindi `hi-IN` or Indian
   English `en-IN`, following the site language).
2. **"Maine suna" check.** The heard text is shown. Numbers are repeated back aloud
   (*"Aapne 8 aur 5 bola, sahi?"*) and need a tap, so a mishearing never becomes a wrong answer.
   Noisy, low-confidence audio gets a "speak again" prompt. Clear questions send themselves after 3 s.
3. **Listen.** The answer is read aloud in a natural Hindi/Indian-English voice, with the spoken word
   highlighted and the chat scrolling along. Hinglish is read by a Hindi voice so it sounds right.
4. **Follow up by voice.** *"phir se batao"* (repeat slowly, free), *"aur simple"*, *"example do"*,
   *"aage batao"*, also as tap chips.
5. **Check understanding.** Say *"samajh gaya"*: the tutor asks one short question. A wrong answer
   saves the topic to **Need Practice**; one tap there starts a 2-minute spoken revision quiz.

The tutor replies in the language the learner spoke or typed, only helps with studies, and also
reads photos of textbook questions.

## Features

- Voice input, read-aloud with word highlight, voice commands, check questions, revision
- English / Hinglish / Hindi interface (navbar switch, default Hinglish)
- Answer styles: Teach, Simple, Hint, Solve, Quiz, Practice, Flashcards, Revise and more
- Learner profile (confidence, patience, learning style) that adapts the answers
- Dashboard with real progress: answers, streak, level, strong and weak topics
- AU token wallet, admin panel (users, chats, transactions, recharges, contact inbox, health)

## Tech

Next.js 14 (App Router), React, Tailwind CSS, MongoDB (Mongoose), OpenRouter (any chat model, with
fallbacks; a vision model for photos), browser Web Speech API for speech-to-text and text-to-speech,
CSS Custom Highlight API, Cloudinary for photos (optional).

## Environment variables

See `.env.example`. Only `MONGODB_URI` is needed to run (docker compose sets it). Optional:
`OPENROUTER_API_KEY` (AI answers), `CLOUDINARY_*` (keep photos in chat history),
`ADMIN_EMAIL` / `ADMIN_PASSWORD` (admin panel), `JWT_SECRET` (set your own outside local use).

## Project layout

```
app/                 pages and API routes (app/api/chat = the tutor)
components/ChatBox.js  voice flow: mic, "Maine suna", commands, check questions
lib/speech.js        read-aloud (voices, chunking, word timing)
lib/speechHighlight.js  highlights the spoken word in the answer
lib/voiceCommands.js "phir se batao", "samajh gaya" ... detection
lib/promptBuilder.js tutor rules, answer styles, language rule
lib/i18n/            English / Hinglish / Hindi texts
```
