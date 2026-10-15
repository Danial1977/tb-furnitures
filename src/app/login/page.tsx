'use client';

import { useState, Suspense } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Lock, ArrowRight, ShieldCheck } from 'lucide-react';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/account';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const res = await signIn('credentials', {
      redirect: false,
      email,
      password,
      callbackUrl,
    });

    setLoading(false);

    if (res?.error) {
      setError('Invalid email or password. Please verify your credentials.');
    } else {
      router.push(callbackUrl);
      router.refresh();
    }
  };

  return (
    <div className="bg-white border border-brand-100 rounded-3xl p-8 shadow-sm space-y-6">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center mx-auto">
          <Lock className="w-5 h-5" />
        </div>
        <h1 className="font-editorial text-2xl font-bold text-charcoal-900">
          Sign In to TB Furnitures
        </h1>
        <p className="text-xs text-charcoal-700/80">
          Access your orders, saved delivery addresses, and guarantees.
        </p>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-charcoal-800 mb-1">
            Email Address
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="eleanor@example.co.uk"
            className="w-full bg-brand-50 border border-brand-200 rounded-xl px-4 py-2.5 text-sm text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-brand-400"
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="text-xs font-semibold text-charcoal-800">
              Password
            </label>
            <Link href="/forgot-password" className="text-[11px] text-brand-600 hover:underline">
              Forgot password?
            </Link>
          </div>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full bg-brand-50 border border-brand-200 rounded-xl px-4 py-2.5 text-sm text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-brand-400"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 bg-charcoal-900 hover:bg-brand-900 disabled:opacity-60 text-white text-xs font-semibold py-3.5 rounded-full transition-colors shadow-sm"
        >
          {loading ? 'Authenticating...' : 'Sign In'}
          <ArrowRight className="w-4 h-4" />
        </button>
      </form>

      <div className="pt-4 border-t border-brand-100 text-center space-y-3">
        <p className="text-xs text-charcoal-700">
          New to TB Furnitures?{' '}
          <Link
            href={`/register?callbackUrl=${encodeURIComponent(callbackUrl)}`}
            className="font-semibold text-brand-700 hover:underline"
          >
            Create an account
          </Link>
        </p>
        <div className="flex items-center justify-center gap-1.5 text-[11px] text-gray-400">
          <ShieldCheck className="w-3.5 h-3.5 text-sage-600" />
          <span>256-bit encrypted authentication</span>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="max-w-md mx-auto px-4 py-16 sm:py-24">
      <Suspense fallback={<div className="text-center py-12 text-sm text-gray-500">Loading login form...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
