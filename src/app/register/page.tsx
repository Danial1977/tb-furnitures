'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { UserPlus, ArrowRight, ShieldCheck } from 'lucide-react';
import { signIn } from 'next-auth/react';

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/account';

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    marketingConsent: false,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password,
          marketingConsent: formData.marketingConsent,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to create account.');
        setLoading(false);
        return;
      }

      await signIn('credentials', {
        redirect: false,
        email: formData.email,
        password: formData.password,
      });

      router.push(callbackUrl);
      router.refresh();
    } catch (err: any) {
      setError('Network error: ' + err.message);
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border border-brand-100 rounded-3xl p-8 shadow-sm space-y-6">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center mx-auto">
          <UserPlus className="w-5 h-5" />
        </div>
        <h1 className="font-editorial text-2xl font-bold text-charcoal-900">
          Create Your TB Account
        </h1>
        <p className="text-xs text-charcoal-700/80">
          Track deliveries, manage UK address book, and unlock private invitations.
        </p>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-charcoal-800 mb-1">
              First Name *
            </label>
            <input
              type="text"
              required
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              placeholder="Eleanor"
              className="w-full bg-brand-50 border border-brand-200 rounded-xl px-4 py-2.5 text-sm text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-brand-400"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-charcoal-800 mb-1">
              Last Name *
            </label>
            <input
              type="text"
              required
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              placeholder="Vance"
              className="w-full bg-brand-50 border border-brand-200 rounded-xl px-4 py-2.5 text-sm text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-brand-400"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-charcoal-800 mb-1">
            Email Address *
          </label>
          <input
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="eleanor@example.co.uk"
            className="w-full bg-brand-50 border border-brand-200 rounded-xl px-4 py-2.5 text-sm text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-brand-400"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-charcoal-800 mb-1">
            Password (min. 8 characters) *
          </label>
          <input
            type="password"
            required
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            placeholder="••••••••"
            className="w-full bg-brand-50 border border-brand-200 rounded-xl px-4 py-2.5 text-sm text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-brand-400"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-charcoal-800 mb-1">
            Confirm Password *
          </label>
          <input
            type="password"
            required
            value={formData.confirmPassword}
            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
            placeholder="••••••••"
            className="w-full bg-brand-50 border border-brand-200 rounded-xl px-4 py-2.5 text-sm text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-brand-400"
          />
        </div>

        <label className="flex items-start gap-2.5 pt-1 text-xs text-charcoal-700 cursor-pointer">
          <input
            type="checkbox"
            checked={formData.marketingConsent}
            onChange={(e) => setFormData({ ...formData, marketingConsent: e.target.checked })}
            className="mt-0.5 rounded text-brand-600 focus:ring-brand-400"
          />
          <span>(Optional) Send me invitations to private sample sales and interior styling guides.</span>
        </label>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 bg-charcoal-900 hover:bg-brand-900 disabled:opacity-60 text-white text-xs font-semibold py-3.5 rounded-full transition-colors shadow-sm"
        >
          {loading ? 'Creating Account...' : 'Complete Registration'}
          <ArrowRight className="w-4 h-4" />
        </button>
      </form>

      <div className="pt-4 border-t border-brand-100 text-center space-y-3">
        <p className="text-xs text-charcoal-700">
          Already have an account?{' '}
          <Link
            href={`/login?callbackUrl=${encodeURIComponent(callbackUrl)}`}
            className="font-semibold text-brand-700 hover:underline"
          >
            Sign In
          </Link>
        </p>
        <div className="flex items-center justify-center gap-1.5 text-[11px] text-gray-400">
          <ShieldCheck className="w-3.5 h-3.5 text-sage-600" />
          <span>UK GDPR compliant privacy policy</span>
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <div className="max-w-md mx-auto px-4 py-16 sm:py-24">
      <Suspense fallback={<div className="text-center py-12 text-sm text-gray-500">Loading registration form...</div>}>
        <RegisterForm />
      </Suspense>
    </div>
  );
}
