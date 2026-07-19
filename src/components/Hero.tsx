import Link from 'next/link';

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-white py-20 sm:py-32">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(45rem_50rem_at_top,theme(colors.emerald.50),white)] opacity-40" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-12 lg:gap-12 lg:items-center">
          {/* Left Content */}
          <div className="lg:col-span-7 flex flex-col justify-center text-center sm:text-left">
            {/* Tag/Badge */}
            <div className="inline-flex items-center justify-center sm:justify-start">
              <span className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-600/10">
                Your Trusted Online Pharmacy
              </span>
            </div>

            <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-zinc-950 sm:text-5xl md:text-6xl">
              Healthcare made simple,{' '}
              <span className="bg-gradient-to-r from-emerald-500 to-teal-600 bg-clip-text text-transparent">
                care delivered fast.
              </span>
            </h1>

            <p className="mt-6 text-lg leading-8 text-zinc-600 max-w-xl mx-auto sm:mx-0">
              Manage prescriptions online, consult with certified pharmacists 24/7, and explore top over-the-counter medicines, vitamins, and healthcare essentials.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center sm:justify-start">
              <Link
                href="/dashboard"
                className="inline-flex h-12 items-center justify-center rounded-full bg-zinc-950 px-6 text-sm font-semibold text-white transition-all hover:bg-zinc-800"
              >
                Refill Prescriptions
              </Link>
              <Link
                href="/products"
                className="inline-flex h-12 items-center justify-center rounded-full border border-zinc-200 bg-white px-6 text-sm font-semibold text-zinc-800 transition-all hover:bg-zinc-50 hover:text-zinc-950"
              >
                Shop OTC &amp; Care
              </Link>
            </div>
          </div>

          {/* Right Visual */}
          <div className="mt-16 lg:mt-0 lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-[420px] aspect-square rounded-3xl bg-zinc-50 border border-zinc-100 p-8 shadow-2xl shadow-zinc-100 flex items-center justify-center overflow-hidden group">
              {/* Decorative grid pattern */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(16,185,129,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(16,185,129,0.04)_1px,transparent_1px)] bg-[size:24px_24px]" />

              {/* Main Circular Ring Visualizer */}
              <div className="relative w-72 h-72 rounded-full border-4 border-dashed border-emerald-500/20 flex items-center justify-center animate-[spin_60s_linear_infinite] group-hover:border-emerald-500/40">
                <div className="w-56 h-56 rounded-full border-2 border-emerald-500/10 flex items-center justify-center" />
              </div>

              {/* Floating Health Card Dashboard Mockup */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 bg-white/90 backdrop-blur-md rounded-2xl border border-zinc-100 p-6 shadow-xl space-y-4 transition-transform group-hover:scale-105 duration-500">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">RX Refill Status</span>
                  </div>
                  <span className="text-xs font-bold text-emerald-600">Ready</span>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-zinc-500">Prescription #49822</span>
                    <span className="font-semibold text-zinc-900">Lipitor 10mg</span>
                  </div>
                  <div className="w-full bg-zinc-100 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-1.5 rounded-full w-full" />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-zinc-500">Next Auto-Refill</span>
                    <span className="font-semibold text-zinc-900">Aug 18</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-zinc-100 text-[10px] text-zinc-500">
                  <span>Pharmacist on Duty</span>
                  <span className="text-emerald-600 font-semibold cursor-pointer hover:text-emerald-500">Chat Live</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
