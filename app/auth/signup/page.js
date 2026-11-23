'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Button from '@/components/Button';
import AuthShell, { authInput } from '@/components/AuthShell';
import { useT } from '@/components/LanguageProvider';
import PasswordInput from '@/components/PasswordInput';

export default function SignupPage() {
  const router = useRouter();

  const t = useT();
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Signup failed');
      }

      router.push('/user/dashboard');
      router.refresh();
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title={t('Create a new account')}
      subtitle={t('Free mein shuru karo. Bolo, suno aur samjho.')}
    >
      {error && (
        <div className="mb-3 rounded-lg bg-coral-50 px-3 py-2.5 text-sm font-medium text-coral-600 animate-slide-up">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="sr-only" htmlFor="name">{t('Full name')}</label>
            <input
              id="name"
              name="name"
              type="text"
              required
              autoComplete="name"
              value={formData.name}
              onChange={handleChange}
              placeholder={t('Full name')}
              className={authInput}
            />
          </div>
          <div>
            <label className="sr-only" htmlFor="email">{t('Email address')}</label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              value={formData.email}
              onChange={handleChange}
              placeholder={t('Email address')}
              className={authInput}
            />
          </div>
          <div>
            <label className="sr-only" htmlFor="password">{t('Password')}</label>
            <PasswordInput
              id="password"
              name="password"
              required
              autoComplete="new-password"
              value={formData.password}
              onChange={handleChange}
              placeholder={t('New password')}
              className={authInput}
            />
          </div>
        <Button type="submit" fullWidth size="lg" loading={loading}>
          {t('Sign up')}
        </Button>
      </form>

      <div className="my-4 border-t border-surface-200" />

      <p className="text-center text-sm text-surface-500">
        {t('Already have an account?')}{' '}
        <Link href="/auth/login" className="font-semibold text-brand-600 hover:underline">
          {t('Log in')}
        </Link>
      </p>
    </AuthShell>
  );
}
