'use client';

import { useEffect } from 'react';
import Link from 'next/link';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Captured Application Error:', error);
  }, [error]);

  return (
    <main className="relative flex min-h-[75vh] flex-grow items-center justify-center overflow-hidden bg-white px-6 py-24 sm:py-32 lg:px-8">
      {/* Background radial glows */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(45rem_50rem_at_top,theme(colors.amber.50),white)] opacity-60" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 w-[300px] h-[300px] sm:w-[500px] sm:h-[500px] rounded-full bg-linear-to-tr from-amber-100/20 to-rose-100/20 blur-3xl" />

      {/* Decorative grid pattern */}
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,rgba(217,119,6,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(217,119,6,0.03)_1px,transparent_1px)] bg-[size:32px_32px]" />

      <div className="mx-auto max-w-lg text-center">
        {/* Animated Icon Illustration Container */}
        <div className="relative mx-auto flex h-48 w-48 items-center justify-center">
          {/* Pulsing rings */}
          <div className="absolute inset-0 animate-ping rounded-full bg-amber-500/5 duration-3000" />
          <div className="absolute inset-4 animate-[pulse_3s_ease-in-out_infinite] rounded-full bg-amber-500/10" />
          
          {/* Main Visual: Pulsing Warning Shield */}
          <div className="relative flex h-36 w-36 items-center justify-center rounded-full bg-white shadow-xl shadow-amber-500/10 border border-zinc-100">
            <svg
              className="h-16 w-16 text-amber-600 animate-[pulse_2s_infinite]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            
            {/* Absolute badge */}
            <div className="absolute -bottom-2 right-2 rounded-full bg-amber-600 px-2.5 py-0.5 text-xs font-bold text-white tracking-wide border border-amber-700">
              Error
            </div>
          </div>
        </div>

        <p className="mt-8 text-xs font-semibold uppercase tracking-wider text-amber-750">
          System Interrupted
        </p>

        <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-zinc-950 sm:text-4xl">
          Something went wrong
        </h1>

        <p className="mt-4 text-base leading-7 text-zinc-650">
          Our servers hit a minor bump in the road while serving your request. Don't worry, your health data is safe. Let's try to restore the session.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => reset()}
            className="w-full sm:w-auto inline-flex h-12 items-center justify-center rounded-full bg-zinc-950 px-6 text-sm font-semibold text-white transition-all hover:bg-zinc-800 hover:shadow-md hover:scale-[1.01] cursor-pointer active:scale-[0.99]"
          >
            Try Again
          </button>
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex h-12 items-center justify-center rounded-full border border-zinc-200 bg-white px-6 text-sm font-semibold text-zinc-850 transition-all hover:bg-zinc-50 hover:text-zinc-950 active:scale-[0.99]"
          >
            Go back Home
          </Link>
        </div>

        {/* Diagnostic Accordion */}
        <details className="group mt-12 text-left border border-zinc-150 rounded-2xl p-4 bg-zinc-50/50 backdrop-blur-md max-w-md mx-auto transition-all duration-300">
          <summary className="flex items-center justify-between text-xs font-semibold text-zinc-500 cursor-pointer select-none list-none">
            <span>Diagnostic Information</span>
            <svg
              className="w-4 h-4 text-zinc-400 group-open:rotate-180 transition-transform duration-200"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </summary>
          <div className="mt-4 border-t border-zinc-150 pt-4 text-xs font-mono text-zinc-600 break-all space-y-2 leading-relaxed">
            <p>
              <span className="font-bold text-zinc-800">Message:</span>{' '}
              {error.message || 'An unexpected runtime error occurred.'}
            </p>
            {error.digest && (
              <p>
                <span className="font-bold text-zinc-800">Digest ID:</span>{' '}
                {error.digest}
              </p>
            )}
          </div>
        </details>
      </div>
    </main>
  );
}
