'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { authClient } from '@/lib/auth-client';

function SignupContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('image', file);

      // Free/Public Imgbb key (or from env)
      const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY?.trim()
      const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      console.log(data);
      if (data.success) {
        setImageUrl(data.data.url);
      } else {
        setError('Image upload failed. You can still register without an avatar.');
      }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      setError('Failed to upload image to Imgbb. You can register without an avatar.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const response = await authClient.signUp.email({
        email,
        password,
        name,
        image: imageUrl || undefined,
        role: 'user',
      });

      if (response.error) {
        setError(response.error.message || 'Failed to create account.');
      } else {
        // Retrieve redirect path
        const callbackUrl = searchParams.get('callbackUrl');
        const redirectFrom = sessionStorage.getItem('redirectFrom');
        const targetUrl = callbackUrl || redirectFrom || '/';

        // Clear redirect cache
        sessionStorage.removeItem('redirectFrom');

        // Redirect
        router.push(targetUrl);
        router.refresh();
      }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err?.message || 'An unexpected error occurred during signup.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-4 py-12 sm:px-6 lg:px-8 font-sans">
      <div className="w-full max-w-md space-y-8">
        {/* Branding */}
        <div className="text-center">
          <Link href="/" className="inline-block">
            <span className="bg-linear-to-r from-emerald-500 to-teal-600 bg-clip-text text-3xl font-bold tracking-tight text-transparent">
              SmartHealth
            </span>
          </Link>
          <h2 className="mt-6 text-2xl font-bold tracking-tight text-zinc-900">
            Create your account
          </h2>
          <p className="mt-2 text-sm text-zinc-500">
            Or{' '}
            <Link
              href="/login"
              className="font-medium text-emerald-600 hover:text-emerald-500 transition-colors"
            >
              sign in to your existing account
            </Link>
          </p>
        </div>

        {/* Card */}
        <div className="bg-white px-8 py-10 rounded-3xl border border-zinc-150 shadow-xl shadow-zinc-150/40 space-y-6">
          {error && (
            <div className="rounded-xl bg-red-50 border border-red-100 p-4">
              <p className="text-sm font-medium text-red-700">{error}</p>
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSignup}>
            {/* Avatar Upload */}
            <div className="flex flex-col items-center space-y-3">
              <label className="block text-sm font-semibold text-zinc-700 self-start">
                Profile Photo (Optional)
              </label>
              <div className="flex items-center space-x-5 w-full">
                <div className="h-16 w-16 shrink-0 rounded-full bg-zinc-100 border border-zinc-200 overflow-hidden flex items-center justify-center relative group">
                  {imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={imageUrl} alt="Avatar Preview" className="h-full w-full object-cover" />
                  ) : (
                    <svg className="h-8 w-8 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  )}
                  {isUploading && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={isUploading}
                    className="block w-full text-xs text-zinc-550 file:mr-3 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 file:cursor-pointer disabled:opacity-50"
                  />
                  <p className="mt-1 text-[10px] text-zinc-400">Supported formats: JPG, PNG, GIF</p>
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-zinc-700">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Jane Doe"
                className="mt-2 block w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm text-zinc-900 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 placeholder-zinc-400"
              />
            </div>

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
              <label htmlFor="password" className="block text-sm font-semibold text-zinc-700">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 8 characters"
                className="mt-2 block w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm text-zinc-900 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 placeholder-zinc-400"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading || isUploading}
                className="relative flex w-full justify-center items-center rounded-full bg-zinc-950 py-3 text-sm font-semibold text-white shadow-sm hover:bg-zinc-800 focus:outline-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                ) : (
                  'Create Account'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-zinc-50">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent" />
      </div>
    }>
      <SignupContent />
    </Suspense>
  );
}
