import Link from 'next/link';
import { Brain, Volume2, TrendingUp, CircleCheck, Mic, Camera, ArrowRight } from 'lucide-react';
import Footer from '@/components/Footer';
import HomeStats from '@/components/HomeStats';
import LogoMark from '@/components/LogoMark';

export const metadata = {
  title: 'BoloPadho — Apne Tarike Se Padho',
  description: 'BoloPadho is a voice-first AI study tutor. Speak your doubt in Hindi, English or Hinglish, listen to a step-by-step answer, and check that you really understood. Apne Tarike Se Padho.',
};

const features = [
  { icon: Mic, title: 'Bolkar poochho', desc: 'Tap the mic and ask your doubt the way you speak, in Hindi, English or Hinglish. No typing needed.' },
  { icon: Volume2, title: 'Sunkar samjho', desc: 'Every answer can be read aloud, with each word highlighted as it is spoken. Say "phir se batao" to hear it again, slowly.' },
  { icon: Camera, title: 'Photo se sawaal', desc: 'Click a photo of the question in your book and get a step-by-step solution.' },
  { icon: Brain, title: 'Apne tarike se', desc: 'Simple words or a deep dive, hints or a full solution. It matches your pace, confidence and learning style.' },
  { icon: CircleCheck, title: 'Samjha ya nahi? Check karo', desc: 'Say "samajh gaya" and it asks one quick question to make sure you really understood.' },
  { icon: TrendingUp, title: 'Kamzor topic, 2 minute revision', desc: 'Topics you get wrong are saved to Need Practice, so you can revise them the next day in two minutes.' },
];

const steps = [
  { title: 'Free account banao', desc: 'Sign up in 30 seconds. New accounts get free AU to start.' },
  { title: 'Bolo, likho ya photo bhejo', desc: 'Ask your study doubt in whichever way is easiest for you.' },
  { title: 'Suno, samjho, check karo', desc: 'Listen to the answer, say "aur simple" or "ek example do", then test yourself.' },
];

// Big headings: last word in the brand colour.
function AccentLast({ children }) {
  const words = String(children).trim().split(' ');
  const last = words.pop();
  return <>{words.join(' ')} <span className="text-brand-500">{last}</span></>;
}

const card = 'fb-card p-4 xl:p-6';

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <div className="mx-auto w-full max-w-page flex-1 space-y-3 lg:space-y-4 p-3 pt-[calc(var(--navbar-h)+0.75rem)] lg:p-4 lg:pt-[calc(var(--navbar-h)+1rem)]">
        {/* ── Hero ───────────────────────────────────────────────────────── */}
        <section className={`${card} grid items-center gap-3 lg:gap-4 lg:grid-cols-2`}>
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-brand-500/15 px-3 py-1 text-sm font-semibold text-brand-600">
              <span className="h-2 w-2 animate-pulse rounded-full bg-brand-500" />
              Voice-first AI tutor · Hindi, English, Hinglish
            </span>
            <h1 className="mt-4 text-3xl font-bold leading-tight text-surface-900 sm:text-4xl lg:text-5xl">
              Bolo apna sawaal. <span className="text-brand-500">Apne Tarike Se</span> Padho.
            </h1>
            <p className="mt-4 text-base leading-relaxed text-surface-500 sm:text-lg">
              Stuck on a question late at night? Just <strong className="font-semibold text-surface-900">tap the mic and speak</strong>.
              BoloPadho explains step by step in your language, reads the answer aloud and checks that you really understood.
              You can also type, or send a photo of your book.
            </p>
            <div className="mt-6 flex flex-col gap-2 sm:flex-row">
              <Link href="/auth/signup" className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-brand-500 px-5 font-semibold text-white transition hover:brightness-110">
                Start learning free <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/auth/login" className="inline-flex h-11 items-center justify-center rounded-lg bg-surface-100 px-5 font-semibold text-surface-900 transition-colors hover:bg-surface-200">
                Log in
              </Link>
            </div>
            <p className="mt-3 text-sm text-surface-500">Free to start · For school, board and competitive exams</p>
          </div>

          {/* Chat preview */}
          <div className="overflow-hidden rounded-lg border border-surface-200 bg-background">
            <div className="flex items-center gap-2 border-b border-surface-200 bg-surface-50 px-3 py-2.5">
              <LogoMark className="h-8 w-8" />
              <div>
                <p className="text-sm font-semibold text-surface-900">BoloPadho Tutor</p>
                <p className="text-xs text-brand-600">Ready to teach</p>
              </div>
            </div>
            <div className="space-y-3 p-3 sm:p-4">
              <div className="flex justify-end">
                <div className="max-w-[80%] rounded-2xl rounded-br-sm bg-brand-500 px-3.5 py-2 text-sm text-white">
                  Bhaiya, triangle ka area wala sawaal samajh nahi aaya. Base 8, height 5.
                </div>
              </div>
              <div className="flex items-end gap-2">
                <LogoMark className="h-7 w-7 shrink-0" />
                <div className="max-w-[85%] rounded-2xl rounded-bl-sm bg-surface-50 px-3.5 py-2 text-sm text-surface-900 shadow-card">
                  Koi baat nahi! Triangle ka area = <strong>½ × base × height</strong>. Yahan ½ × 8 × 5 = <strong>20 sq units</strong>.
                  Socho ek rectangle ko beech se aadha kaat diya, to triangle bachta hai…
                </div>
              </div>
              <div className="flex items-center gap-2 rounded-full bg-surface-50 p-1.5 pl-2 shadow-card">
                <Camera className="h-5 w-5 text-surface-500" />
                <span className="flex-1 truncate text-sm text-surface-400">Bolo ya likho…</span>
                <Mic className="h-5 w-5 text-surface-500" />
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-500 text-white"><ArrowRight className="h-4 w-4" /></span>
              </div>
            </div>
          </div>
        </section>

        {/* ── Stats ──────────────────────────────────────────────────────── */}
        <HomeStats />

        {/* ── Features ───────────────────────────────────────────────────── */}
        <section className={card}>
          <h2 className="text-2xl font-bold text-surface-900 sm:text-3xl"><AccentLast>Kyun BoloPadho?</AccentLast></h2>
          <p className="mt-1 text-surface-500">Made for students who find it easier to speak a doubt than to type it.</p>
          <div className="mt-4 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {features.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex gap-3 rounded-lg border border-surface-200 p-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-500/15 text-brand-600">
                  <Icon className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="font-semibold text-surface-900">{title}</h3>
                  <p className="mt-0.5 text-sm leading-relaxed text-surface-500">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── How it works ───────────────────────────────────────────────── */}
        <section className={card}>
          <h2 className="text-2xl font-bold text-surface-900 sm:text-3xl"><AccentLast>Bas teen steps</AccentLast></h2>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            {steps.map((s, i) => (
              <div key={s.title} className="flex gap-3 rounded-lg bg-surface-100 p-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-500 font-bold text-white">{i + 1}</span>
                <div>
                  <h3 className="font-semibold text-surface-900">{s.title}</h3>
                  <p className="mt-0.5 text-sm text-surface-500">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── CTA ────────────────────────────────────────────────────────── */}
        <section className={`${card} flex flex-col items-center gap-4 text-center sm:flex-row sm:text-left`}>
          <LogoMark className="h-14 w-14 shrink-0" />
          <div className="flex-1">
            <h2 className="text-xl font-bold text-surface-900 sm:text-2xl"><AccentLast>Apna pehla sawaal bolo</AccentLast></h2>
            <p className="text-surface-500">School homework, board exams or competitive exams: Apne Tarike Se Padho.</p>
          </div>
          <Link href="/auth/signup" className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-brand-500 px-5 font-semibold text-white transition hover:brightness-110">
            Start free <ArrowRight className="h-4 w-4" />
          </Link>
        </section>
      </div>
      <Footer />
    </div>
  );
}
