'use client';

import { useState } from 'react';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setIsSubmitted(true);
      setEmail('');
      setTimeout(() => setIsSubmitted(false), 5000);
    }
  };

  return (
    <section className="bg-zinc-950 py-16 dark:bg-zinc-900/50 sm:py-24 border-t border-zinc-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative isolate overflow-hidden bg-zinc-900 px-6 py-12 shadow-2xl rounded-3xl sm:px-12 md:py-16 lg:flex lg:items-center lg:gap-x-12 lg:px-16">
          {/* Background shapes */}
          <svg
            viewBox="0 0 1024 1024"
            className="absolute top-1/2 left-1/2 -z-10 h-256 w-5xl -translate-y-1/2 mask-[radial-gradient(closest-side,white,transparent)] sm:left-full sm:-ml-80 lg:left-1/2 lg:ml-0 lg:-translate-x-1/2 lg:translate-y-0"
            aria-hidden="true"
          >
            <circle cx="512" cy="512" r="512" fill="url(#759c1415-0410-454c-8f7c-9a820de03641)" fillOpacity="0.15" />
            <defs>
              <radialGradient id="759c1415-0410-454c-8f7c-9a820de03641">
                <stop stopColor="#10b981" />
                <stop offset="1" stopColor="#047857" />
              </radialGradient>
            </defs>
          </svg>

          {/* Heading */}
          <div className="max-w-xl lg:max-w-md lg:flex-auto">
            <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Stay ahead of your health.
            </h2>
            <p className="mt-4 text-base leading-6 text-zinc-400">
              Subscribe to the SmartHealth newsletter for clinically verified health insights, product drops, and exclusive discounts.
            </p>
          </div>

          {/* Form */}
          <div className="mt-8 w-full max-w-md lg:mt-0 lg:flex-auto">
            {isSubmitted ? (
              <div className="rounded-xl bg-emerald-950/30 border border-emerald-500/20 p-4 text-center">
                <p className="text-sm font-semibold text-emerald-400">
                  🎉 Thank you for subscribing! Check your inbox soon.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-x-4 gap-y-3">
                <label htmlFor="email-address" className="sr-only">
                  Email address
                </label>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="min-w-0 flex-auto rounded-full border-0 bg-white/5 px-5 py-3 text-sm text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-emerald-500 sm:leading-6"
                  placeholder="Enter your email"
                />
                <button
                  type="submit"
                  className="flex-none rounded-full bg-white px-5 py-3 text-sm font-semibold text-zinc-900 shadow-sm hover:bg-zinc-100 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-white transition-colors"
                >
                  Subscribe
                </button>
              </form>
            )}
            <p className="mt-3 text-xs leading-5 text-zinc-500">
              We care about your data. Read our{' '}
              <a href="/privacy" className="font-semibold text-white hover:text-emerald-400">
                privacy policy
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
