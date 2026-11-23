'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import Card from '@/components/Card';
import ProgressBar from '@/components/ProgressBar';
import { PageLoader } from '@/components/Loader';
import Button from '@/components/Button';
import api from '@/lib/api';
import LogoMark from '@/components/LogoMark';
import { useT } from '@/components/LanguageProvider';

export default function DashboardPage() {
  const router = useRouter();
  const t = useT();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        // Get user role from localStorage
        const storedUser = JSON.parse(localStorage.getItem('user'));
        const role = storedUser?.role || 'user';

        // Call API based on role
        const endpoint = role === 'admin' ? '/admin/profile' : '/user/profile';
        const data = await api.get(endpoint);
        setData(data);
      } catch (err) {
        console.error('Failed to fetch dashboard data:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) return <PageLoader />;

  const { user, stats, recentChats } = data || {};

  return (
    <div className="flex min-h-screen">
      <Sidebar user={user} />

      <main className="flex-1 min-w-0 lg:ml-sidebar pt-navbar *:mx-auto *:w-full *:max-w-page *:p-3 lg:*:p-4 app-content">
        <div className="animate-fade-in">
          {/* Welcome Header */}
          <header className="mb-3 flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
            <div>
              <h1 className="text-xl font-bold text-surface-900 lg:text-2xl">
                {t('Welcome, {name}! 👋', { name: user?.name?.split(' ')[0] || '' })}
              </h1>
              <p className="text-sm font-medium text-surface-500">
                {t('Aaj kya padhna hai? Mic dabao aur bolo.')}
              </p>
            </div>
            <Link href="/user/chat" className="w-full sm:w-auto">
              <Button fullWidth className="sm:w-auto">
                🎙️ {t('Start Learning')}
              </Button>
            </Link>
          </header>

          <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
            {/* Main stats column */}
            <div className="lg:col-span-2 space-y-3">
              {/* Progress Card */}
              {/* Compact: one row of small stat tiles (icon beside the number) and a one-line wallet strip */}
              <Card padding="sm" className="border-b-4 border-brand-200">
                <div className="mb-2 flex items-center justify-between">
                  <h2 className="text-lg font-bold text-surface-900">{t('Your Progress')}</h2>
                  <span className="rounded-full bg-brand-50 px-2.5 py-0.5 text-[11px] font-bold text-brand-600">
                    {t('{n} answers this week', { n: stats?.answersThisWeek || 0 })}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {[
                    { icon: '🔥', value: user?.streak || 0, label: 'Day streak' },
                    { icon: '💬', value: stats?.answers || 0, label: 'Answers' },
                    { icon: '🎓', value: stats?.totalSessions || 0, label: 'Sessions' },
                    { icon: '🌍', value: user?.topicsExplored?.length || 0, label: 'Topics' },
                  ].map((s) => (
                    <div key={s.label} className="flex min-w-0 items-center gap-2 rounded-lg border border-surface-200 bg-surface-100 px-2.5 py-2">
                      <span className="text-xl leading-none">{s.icon}</span>
                      <div className="min-w-0">
                        <p className="text-base font-bold leading-tight text-surface-900">{s.value}</p>
                        <p className="truncate text-[11px] font-semibold uppercase text-surface-400">{t(s.label)}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-2 flex items-center justify-between gap-2 rounded-lg border border-brand-100 bg-brand-50 px-2.5 py-1.5">
                  <p className="flex min-w-0 items-center gap-1.5 text-xs font-semibold text-brand-700">
                    <span>🛡️</span>
                    <span className="truncate">{t('Wallet secure · Recharge anytime')}</span>
                  </p>
                  <Link href="/user/wallet" className="shrink-0 text-xs font-bold text-brand-600 hover:underline">
                    {t('View wallet →')}
                  </Link>
                </div>
              </Card>

              {/* Recent Sessions */}
              <Card padding="sm">
                <div className="mb-2 flex items-center justify-between">
                  <h2 className="text-lg font-bold text-surface-900">{t('Recent Chats')}</h2>
                  <Link href="/user/chats" className="text-sm font-bold text-brand-600 hover:underline">
                    {t('View all →')}
                  </Link>
                </div>

                <div className="space-y-1.5">
                  {recentChats && recentChats.length > 0 ? (
                    recentChats.map((chat) => (
                      <Link
                        key={chat.sessionId}
                        href={`/user/chat?sessionId=${chat.sessionId}`}
                        className="flex items-center justify-between gap-2 rounded-lg border border-surface-200 bg-surface-100 px-2.5 py-2 transition-colors hover:border-brand-500 hover:bg-brand-50"
                      >
                        <div className="flex min-w-0 items-center gap-2.5">
                          <span className="text-lg leading-none">
                            {chat.topic ? '📚' : '💬'}
                          </span>
                          <div className="min-w-0">
                            <p className="truncate text-sm font-bold leading-snug text-surface-800">
                              {chat.title || t('Untitled Session')}
                            </p>
                            <p className="text-[11px] font-medium text-surface-400">
                              {new Date(chat.updatedAt).toLocaleDateString()} · {t('{n} messages', { n: chat.sessionMetrics?.messageCount || 0 })}
                            </p>
                          </div>
                        </div>
                        <span className="shrink-0 rounded-md bg-accent-100 px-1.5 py-0.5 text-[11px] font-bold text-accent-700">
                          −{chat.auEarned || 0} AU
                        </span>
                      </Link>
                    ))
                  ) : (
                    <div className="text-center py-6">
                      <LogoMark className="mx-auto mb-3 h-12 w-12" />
                      <p className="text-surface-500 font-semibold mb-4">{t('No learning sessions yet.')}</p>
                      <Link href="/user/chat">
                        <Button variant="outline" size="sm">{t('Start your first lesson')}</Button>
                      </Link>
                    </div>
                  )}
                </div>
              </Card>
            </div>

            {/* Side stats Column */}
            <div className="space-y-3">
              {/* Level Badge Detail */}
              {/* Everything left-aligned on one edge: level circle + title, then one row of chips.
                  (The old "points to next level" line mixed level with the AU wallet balance and went negative.) */}
              <Card padding="sm" className="bg-gradient-to-br from-brand-50 to-ocean-50 border-brand-100">
                <div className="flex items-center gap-3">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand-500 text-lg font-bold text-white">
                    {user?.level || 1}
                  </span>
                  <div className="min-w-0">
                    <h3 className="text-lg font-bold leading-tight text-surface-900">{t('Level {level} Learner', { level: user?.level || 1 })}</h3>
                    <p className="mt-0.5 text-xs font-semibold text-surface-500">
                      {t('{n} more answers to Level {level}', { n: stats?.answersToNextLevel ?? 10, level: (user?.level || 1) + 1 })}
                    </p>
                  </div>
                </div>
                {/* Real progress inside the current level (every answersPerLevel answers = one level) */}
                <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-surface-200">
                  <div
                    className="h-full rounded-full bg-brand-500"
                    style={{ width: `${(((stats?.answersPerLevel || 10) - (stats?.answersToNextLevel ?? 10)) / (stats?.answersPerLevel || 10)) * 100}%` }}
                  />
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <span className="inline-flex h-7 items-center gap-1 rounded-full bg-surface-100 px-2.5 text-xs font-bold text-surface-900">
                    🪙 {user?.au || 0} AU
                  </span>
                  {(user?.streak || 0) > 0 && (
                    <span className="inline-flex h-7 items-center gap-1 rounded-full bg-surface-100 px-2.5 text-xs font-bold text-accent-600">
                      🔥 {t('{n} day streak', { n: user.streak })}
                    </span>
                  )}
                  {(user?.streak || 0) >= 3 && (
                    <span className="inline-flex h-7 items-center gap-1 rounded-full bg-surface-100 px-2.5 text-xs font-bold text-brand-600">
                      ⚡ {t('On fire')}
                    </span>
                  )}
                </div>
              </Card>

              {/* Topics Explored */}
              <Card padding="sm">
                <h3 className="mb-2 flex items-center gap-2 text-base font-bold text-surface-900">
                  <span>📚</span> {t('Strong Topics')}
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {(user?.strongAreas?.length || 0) > 0 ? (
                    user.strongAreas.map((topic) => (
                      <span key={topic} className="rounded-full border border-surface-200 bg-surface-50 px-2.5 py-1 text-xs font-bold text-surface-700">
                        {topic}
                      </span>
                    ))
                  ) : (
                    <p className="text-xs text-surface-400 font-medium">{t('Say "samajh gaya" after an answer and get the check question right to add a topic here.')}</p>
                  )}
                </div>

                <hr className="my-3 border-surface-100" />

                <h3 className="mb-2 flex items-center gap-2 text-base font-bold text-surface-900">
                  <span>🎯</span> {t('Need Practice')}
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {(user?.weakAreas?.length || 0) > 0 ? (
                    user.weakAreas.map((topic) => (
                      <Link
                        key={topic}
                        href={`/user/chat?revise=${encodeURIComponent(topic)}`}
                        title={t('Start a 2-minute revision')}
                        className="rounded-full border border-coral-200 bg-coral-50 px-2.5 py-1 text-xs font-bold text-coral-700 transition-colors hover:bg-coral-100"
                      >
                        {topic} · {t('Revise')}
                      </Link>
                    ))
                  ) : (
                    <p className="text-xs text-surface-400 font-medium">{t('No weak topics yet. Topics you get wrong in a check question show up here for a 2-minute revision.')}</p>
                  )}
                </div>
              </Card>

              {/* Mindset Card */}
              <Card padding="sm" className="border-b-4 border-purple-200">
                <div className="mb-2 flex items-baseline justify-between gap-2">
                  <h3 className="text-base font-bold text-surface-900">{t('My Mindset')}</h3>
                  <p className="text-[11px] font-bold uppercase text-surface-500">{t('Personalized profile')}</p>
                </div>

                <div className="space-y-2.5">
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-bold uppercase text-surface-400">
                      <span>{t('Impatient')}</span>
                      <span>{t('Patient')}</span>
                    </div>
                    <ProgressBar value={user?.mindsetProfile?.patience * 100 || 50} max={100} height="sm" color="purple" animated={false} />
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-bold uppercase text-surface-400">
                      <span>{t('Cautious')}</span>
                      <span>{t('Confident')}</span>
                    </div>
                    <ProgressBar value={user?.mindsetProfile?.confidence * 100 || 50} max={100} height="sm" color="brand" animated={false} />
                  </div>
                </div>

                <Button variant="ghost" size="sm" fullWidth className="mt-3 text-xs" onClick={() => (window.location.href = '/user/profile')}>
                  {t('Personalize Profile →')}
                </Button>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
