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
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  // Helper to handle post-login redirect
  const handleRedirect = () => {
    const callbackUrl = searchParams.get('callbackUrl');
    const redirectFrom = sessionStorage.getItem('redirectFrom');
    const targetUrl = callbackUrl || redirectFrom || '/';

    sessionStorage.removeItem('redirectFrom');
    router.push(targetUrl);
    router.refresh();
  };

  // Reusable login handler for forms & demo buttons
  const executeEmailLogin = async (loginEmail: string, loginPass: string) => {
    setError(null);
    setIsLoading(true);

    try {
      const response = await authClient.signIn.email({
        email: loginEmail,
        password: loginPass,
      });

      if (response.error) {
        setError(response.error.message || 'Invalid email or password.');
      } else {
        handleRedirect();
      }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err?.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    await executeEmailLogin(email, password);
  };

  // Google Social Sign-In
  const handleGoogleLogin = async () => {
    setError(null);
    setIsGoogleLoading(true);

    try {
      const callbackUrl = searchParams.get('callbackUrl');
      const redirectFrom = sessionStorage.getItem('redirectFrom');
      const targetUrl = callbackUrl || redirectFrom || '/';

      await authClient.signIn.social({
        provider: 'google',
        callbackURL: targetUrl,
      });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err?.message || 'Failed to sign in with Google. Please try again.');
      setIsGoogleLoading(false);
    }
  };

  // One-Click Demo Sign-In Action
  const handleDemoLogin = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    executeEmailLogin(demoEmail, demoPass);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-4 py-12 sm:px-6 lg:px-8 font-sans">
      <div className="w-full max-w-md space-y-8">
        {/* Logo / Branding */}
        <div className="text-center">
          <Link href="/" className="inline-block">
            <span className="bg-linear-to-r from-emerald-500 to-teal-600 bg-clip-text text-3xl font-bold tracking-tight text-transparent">
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

          {/* Social Sign-In (Google) */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={isLoading || isGoogleLoading}
            className="flex w-full items-center justify-center gap-3 rounded-full border border-zinc-200 bg-white px-4 py-3 text-sm font-semibold text-zinc-700 shadow-xs hover:bg-zinc-50 focus:outline-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGoogleLoading ? (
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-zinc-600 border-t-transparent" />
            ) : (
              <>
                <svg className="h-5 w-5" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    fill="#EA4335"
                  />
                </svg>
                Continue with Google
              </>
            )}
          </button>

          {/* Divider */}
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-zinc-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-3 text-zinc-400 font-medium">Or continue with email</span>
            </div>
          </div>

          {/* Email / Password Form */}
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
                className="mt-2 block w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm text-zinc-900 shadow-xs focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 placeholder-zinc-400"
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
                className="mt-2 block w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm text-zinc-900 shadow-xs focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 placeholder-zinc-400"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading || isGoogleLoading}
                className="relative flex w-full justify-center items-center rounded-full bg-zinc-950 py-3 text-sm font-semibold text-white shadow-xs hover:bg-zinc-800 focus:outline-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                ) : (
                  'Sign In'
                )}
              </button>
            </div>
          </form>

          {/* Demo Login Shortcuts */}
          <div className="mt-6 pt-4 border-t border-zinc-100 space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400 text-center">
              One-Click Demo Login
            </p>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                disabled={isLoading || isGoogleLoading}
                onClick={() => handleDemoLogin('fejades@mailinator.com', 'Pa$$w0rd!')}
                className="flex items-center justify-center rounded-xl border border-amber-200 bg-amber-50/60 px-3 py-2.5 text-xs font-semibold text-amber-900 hover:bg-amber-100 focus:outline-none transition-colors disabled:opacity-50"
              >
                🔑 Admin Demo
              </button>
              <button
                type="button"
                disabled={isLoading || isGoogleLoading}
                onClick={() => handleDemoLogin('mmmdmoynulislam@gmail.com', '12345678')}
                className="flex items-center justify-center rounded-xl border border-emerald-200 bg-emerald-50/60 px-3 py-2.5 text-xs font-semibold text-emerald-900 hover:bg-emerald-100 focus:outline-none transition-colors disabled:opacity-50"
              >
                👤 User Demo
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-zinc-50">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent" />
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}