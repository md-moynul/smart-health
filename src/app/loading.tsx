export default function Loading() {
  return (
    <main className="relative flex-grow bg-white py-16 sm:py-24">
      {/* Background decoration glows */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(45rem_50rem_at_top,theme(colors.emerald.50),white)] opacity-40" />
      
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Loading Spinner Header */}
        <div className="flex flex-col items-center justify-center space-y-4 mb-16">
          <div className="relative flex h-16 w-16 items-center justify-center">
            {/* Spinning outer ring */}
            <div className="absolute inset-0 rounded-full border-4 border-emerald-100 border-t-emerald-600 animate-spin" />
            {/* Pulsing inner glow */}
            <div className="h-8 w-8 rounded-full bg-emerald-500/10 animate-pulse flex items-center justify-center">
              <div className="h-3 w-3 rounded-full bg-emerald-500" />
            </div>
          </div>
          <div className="text-center space-y-1">
            <h3 className="text-sm font-semibold text-zinc-900 tracking-wide animate-pulse">
              Optimizing your experience
            </h3>
            <p className="text-xs text-zinc-500">
              Retrieving secure health records &amp; inventory...
            </p>
          </div>
        </div>

        {/* Skeleton Grid representing health pages/products */}
        <div className="space-y-10">
          {/* Hero Banner Skeleton */}
          <div className="w-full h-48 sm:h-64 rounded-3xl bg-zinc-50 border border-zinc-150 p-8 flex flex-col justify-end space-y-4 relative overflow-hidden">
            {/* Shimmer overlay effect */}
            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent animate-[shimmer_2s_infinite]" />
            
            <div className="h-6 bg-zinc-200/80 rounded-md w-1/3 animate-pulse" />
            <div className="h-4 bg-zinc-200/80 rounded-md w-1/2 animate-pulse" />
            <div className="h-10 bg-zinc-200/85 rounded-full w-28 animate-pulse" />
          </div>

          {/* Product Cards Skeleton Grid */}
          <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-x-8">
            {[...Array(4)].map((_, index) => (
              <div
                key={index}
                className="group relative flex flex-col rounded-2xl border border-zinc-100 bg-white p-4 shadow-sm space-y-4"
              >
                {/* Product Image placeholder */}
                <div className="aspect-square w-full rounded-xl bg-zinc-105 animate-pulse flex items-center justify-center">
                  <svg
                    className="h-12 w-12 text-zinc-250"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>

                {/* Category tag */}
                <div className="h-4 bg-zinc-100 rounded-md w-1/4 animate-pulse" />

                {/* Title */}
                <div className="space-y-2">
                  <div className="h-5 bg-zinc-200/80 rounded-md w-3/4 animate-pulse" />
                  <div className="h-4 bg-zinc-105 rounded-md w-1/2 animate-pulse" />
                </div>

                {/* Footer section (Price & Button) */}
                <div className="flex items-center justify-between pt-2">
                  <div className="h-6 bg-zinc-200 rounded-md w-1/5 animate-pulse" />
                  <div className="h-9 bg-zinc-150 rounded-full w-20 animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
