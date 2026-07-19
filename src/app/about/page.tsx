import Link from 'next/link';

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-zinc-50 text-zinc-900 antialiased selection:bg-emerald-500/30">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-linear-to-b from-emerald-50/50 via-white to-zinc-50 px-6 pt-24 pb-16 sm:px-8 lg:px-12 lg:pt-32">
        <div className="mx-auto max-w-4xl text-center">
          <span className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-600/10">
            Our Mission
          </span>
          <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-zinc-950 sm:text-5xl lg:text-6xl">
            Empowering health through{' '}
            <span className="bg-linear-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
              beautiful data.
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-zinc-600">
            SmartHealth is a premium healthcare management platform built to bridge the gap between complex clinical data and human-centric design. We empower both patients and providers with a seamless, secure experience.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link
              href="/"
              className="rounded-xl bg-zinc-900 px-5 py-3 text-sm font-semibold text-white shadow-xs hover:bg-zinc-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900 transition-all"
            >
              Return to Home
            </Link>
          </div>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="mx-auto max-w-5xl px-6 py-16 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
          <div className="rounded-2xl border border-zinc-200/60 bg-white p-8 shadow-xs">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="mt-4 font-semibold text-zinc-950">Bank-Grade Security</h3>
            <p className="mt-2 text-sm text-zinc-600 leading-relaxed">Your health telemetry is safeguarded with state-of-the-art end-to-end encryption compliance protocols.</p>
          </div>

          <div className="rounded-2xl border border-zinc-200/60 bg-white p-8 shadow-xs">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="mt-4 font-semibold text-zinc-950">Actionable Insights</h3>
            <p className="mt-2 text-sm text-zinc-600 leading-relaxed">No confusing medical jargon. We turn raw biological numbers into clean, straightforward metrics.</p>
          </div>

          <div className="rounded-2xl border border-zinc-200/60 bg-white p-8 shadow-xs">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h3 className="mt-4 font-semibold text-zinc-950">Human-Centric Design</h3>
            <p className="mt-2 text-sm text-zinc-600 leading-relaxed">Built with extreme empathy for the user interface. Accessible, aesthetic, and inclusive for all.</p>
          </div>
        </div>
      </section>

      {/* Quick Trust Stats Counter */}
      <section className="border-t border-zinc-200/80 bg-zinc-100/50 py-12">
        <div className="mx-auto max-w-4xl px-6">
          <dl className="grid grid-cols-3 gap-4 text-center">
            <div>
              <dd className="text-3xl font-bold tracking-tight text-zinc-900">99.9%</dd>
              <dt className="mt-1 text-xs font-medium uppercase tracking-wider text-zinc-500">Uptime Reliability</dt>
            </div>
            <div>
              <dd className="text-3xl font-bold tracking-tight text-zinc-900">10k+</dd>
              <dt className="mt-1 text-xs font-medium uppercase tracking-wider text-zinc-500">Active Patients</dt>
            </div>
            <div>
              <dd className="text-3xl font-bold tracking-tight text-zinc-900">256-bit</dd>
              <dt className="mt-1 text-xs font-medium uppercase tracking-wider text-zinc-500">AES Encryption</dt>
            </div>
          </dl>
        </div>
      </section>
    </main>
  );
}