'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { authClient } from '@/lib/auth-client';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const response = await authClient.signIn.email({
        email,
        password,
      });
      console.log(response)
      // if (response.error) {
      //   setError(response.error.message || 'Invalid email or password.');
      // } else {
      //   // Retrieve the redirect path from query parameter or sessionStorage
      //   const callbackUrl = searchParams.get('callbackUrl');
      //   const redirectFrom = sessionStorage.getItem('redirectFrom');
      //   const targetUrl = callbackUrl || redirectFrom || '/';

      //   // Clear sessionStorage redirect state
      //   sessionStorage.removeItem('redirectFrom');

      //   // Redirect back
      //   router.push(targetUrl);
      //   router.refresh();
      // }
    } catch (err: any) {
      setError(err?.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-4 py-12 sm:px-6 lg:px-8 font-sans">
      <div className="w-full max-w-md space-y-8">
        {/* Logo/Branding */}
        <div className="text-center">
          <Link href="/" className="inline-block">
            <span className="bg-gradient-to-r from-emerald-500 to-teal-600 bg-clip-text text-3xl font-bold tracking-tight text-transparent">
              SmartHealth
            </span>
          </Link>
          <h2 className="mt-6 text-2xl font-bold tracking-tight text-zinc-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-sm text-zinc-500">
            Or{' '}
            <Link
              href="/signup"
              className="font-medium text-emerald-600 hover:text-emerald-500 transition-colors"
            >
              create a new account
            </Link>
          </p>
        </div>

        {/* Card wrapper */}
        <div className="bg-white px-8 py-10 rounded-3xl border border-zinc-150 shadow-xl shadow-zinc-150/40 space-y-6">
          {error && (
            <div className="rounded-xl bg-red-50 border border-red-100 p-4">
              <p className="text-sm font-medium text-red-700">{error}</p>
            </div>
          )}

          <form className="space-y-5" onSubmit={handleLogin}>
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-zinc-700">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="mt-2 block w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm text-zinc-900 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 placeholder-zinc-400"
              />
            </div>

            <div>
              <div className="flex justify-between items-center">
                <label htmlFor="password" className="block text-sm font-semibold text-zinc-700">
                  Password
                </label>
                <a href="#" className="text-xs font-semibold text-emerald-600 hover:text-emerald-500">
                  Forgot password?
                </a>
              </div>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="mt-2 block w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm text-zinc-900 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 placeholder-zinc-400"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="relative flex w-full justify-center items-center rounded-full bg-zinc-950 py-3 text-sm font-semibold text-white shadow-sm hover:bg-zinc-800 focus:outline-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                ) : (
                  'Sign In'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-zinc-50">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent" />
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}
