'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function NotFound() {
  const router = useRouter();

  return (
    <main className="relative flex min-h-[75vh] flex-grow items-center justify-center overflow-hidden bg-white px-6 py-24 sm:py-32 lg:px-8">
      {/* Background radial glows */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(45rem_50rem_at_top,theme(colors.emerald.50),white)] opacity-60" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 w-[300px] h-[300px] sm:w-[500px] sm:h-[500px] rounded-full bg-linear-to-tr from-emerald-100/20 to-teal-100/20 blur-3xl" />

      {/* Decorative grid pattern */}
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,rgba(16,185,129,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(16,185,129,0.03)_1px,transparent_1px)] bg-[size:32px_32px]" />

      <div className="mx-auto max-w-lg text-center">
        {/* Animated Icon Illustration Container */}
        <div className="relative mx-auto flex h-48 w-48 items-center justify-center">
          {/* Pulsing rings */}
          <div className="absolute inset-0 animate-ping rounded-full bg-emerald-500/5 duration-3000" />
          <div className="absolute inset-4 animate-[pulse_3s_ease-in-out_infinite] rounded-full bg-emerald-500/10" />
          
          {/* Main Visual: 404 Leaf Compass */}
          <div className="relative flex h-36 w-36 items-center justify-center rounded-full bg-white shadow-xl shadow-emerald-500/10 border border-zinc-100">
            <svg
              className="h-16 w-16 text-emerald-600 animate-[bounce_2s_infinite]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m11.314 11.314l.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 8c-1.5 0-3 1-3 3s1.5 3 3 3 3-1 3-3-1.5-3-3-3z"
                className="text-teal-500 animate-[spin_8s_linear_infinite]"
              />
            </svg>
            
            {/* Absolute badge for "404" */}
            <div className="absolute -bottom-2 right-2 rounded-full bg-zinc-950 px-2.5 py-0.5 text-xs font-bold text-white tracking-wide border border-zinc-800">
              404
            </div>
          </div>
        </div>

        <p className="mt-8 text-xs font-semibold uppercase tracking-wider text-emerald-700">
          Page Not Found
        </p>

        <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-zinc-950 sm:text-4xl">
          Where did it go?
        </h1>

        <p className="mt-4 text-base leading-7 text-zinc-650">
          We searched everywhere, but this wellness remedy seems to have wandered off. Let's get you back on track to good health.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex h-12 items-center justify-center rounded-full bg-zinc-950 px-6 text-sm font-semibold text-white transition-all hover:bg-zinc-800 hover:shadow-md hover:scale-[1.01] active:scale-[0.99]"
          >
            Back to Home
          </Link>
          <Link
            href="/products"
            className="w-full sm:w-auto inline-flex h-12 items-center justify-center rounded-full border border-zinc-200 bg-white px-6 text-sm font-semibold text-zinc-850 transition-all hover:bg-zinc-50 hover:text-zinc-950 active:scale-[0.99]"
          >
            Explore Products
          </Link>
          <button
            onClick={() => router.back()}
            className="w-full sm:w-auto inline-flex h-12 items-center justify-center rounded-full bg-zinc-50 px-6 text-sm font-semibold text-zinc-700 transition-all hover:bg-zinc-100 hover:text-zinc-900 cursor-pointer active:scale-[0.99]"
          >
            Go Back
          </button>
        </div>
      </div>
    </main>
  );
}
