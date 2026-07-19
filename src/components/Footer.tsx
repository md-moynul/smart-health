'use client';

import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  /* Footer visible on dashboard */

  return (
    <footer className="bg-white border-t border-zinc-100">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          
          {/* Logo & Info column */}
          <div className="space-y-6">
            <span className="bg-linear-to-r from-emerald-500 to-teal-600 bg-clip-text text-xl font-bold tracking-tight text-transparent">
              SmartHealth
            </span>
            <p className="text-sm text-zinc-550 max-w-xs">
              Merging biological telemetry with daily formulations to deliver optimal health, longevity, and performance.
            </p>
            {/* Social Icons */}
            <div className="flex space-x-5">
              <a href="#" className="text-zinc-400 hover:text-zinc-950">
                <span className="sr-only">Twitter</span>
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a href="#" className="text-zinc-400 hover:text-zinc-950">
                <span className="sr-only">Instagram</span>
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M12.315 2.251C11.07.271 9.05.087 6 0H3.333c-3.05 0-5.07.27-6 .701C-9.92 1.4-11 2.48-11 3.53a83.66 83.66 0 00-.701 6.002v2.666c0 3.05.27 5.07.701 6 .701 1.25 1.78 2.28 2.83 2.83.93.43 2.95.701 6 .701h2.666c3.05 0 5.07-.27 6-.701 1.25-.701 2.28-1.78 2.83-2.83.43-.93.701-2.95.701-6v-2.666c0-3.05-.27-5.07-.701-6-.701-1.25-1.78-2.28-2.83-2.83zM12 21.354c-2.946 0-4.908-.261-5.733-.642-.996-.465-1.754-1.223-2.22-2.219-.38-.825-.642-2.787-.642-5.733v-2.666c0-2.946.261-4.908.642-5.733.466-.996 1.224-1.754 2.22-2.22.825-.38 2.787-.642 5.733-.642h2.666c2.946 0 4.908.261 5.733.642.996.466 1.754 1.224 2.22 2.22.38.825.642 2.787.642 5.733v2.666c0 2.946-.261 4.908-.642 5.733-.466.996-1.224 1.754-2.22 2.22-.825.38-2.787.642-5.733.642H12z" clipRule="evenodd" />
                  <path fillRule="evenodd" d="M12 12.75a3.75 3.75 0 100-7.5 3.75 3.75 0 000 7.5zm0-1.5a2.25 2.25 0 110-4.5 2.25 2.25 0 010 4.5z" clipRule="evenodd" />
                  <path d="M16.875 6a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                </svg>
              </a>
              <a href="#" className="text-zinc-400 hover:text-zinc-950">
                <span className="sr-only">GitHub</span>
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.646.64.699 1.026 1.592 1.026 2.683 0 3.842-2.337 4.687-4.565 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C19.138 20.161 22 16.416 22 12c0-5.523-4.477-10-10-10z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
          </div>

          {/* Links columns */}
          <div className="mt-12 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold text-zinc-900 tracking-wider">
                  Quick Links
                </h3>
                <ul role="list" className="mt-4 space-y-4">
                  <li>
                    <Link href="/" className="text-sm text-zinc-550 hover:text-zinc-950">
                      Home
                    </Link>
                  </li>
                  <li>
                    <Link href="/products" className="text-sm text-zinc-550 hover:text-zinc-950">
                      Shop Products
                    </Link>
                  </li>
                  <li>
                    <Link href="/about" className="text-sm text-zinc-550 hover:text-zinc-950">
                      About Us
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="mt-12 md:mt-0">
                <h3 className="text-sm font-semibold text-zinc-900 tracking-wider">
                  Support
                </h3>
                <ul role="list" className="mt-4 space-y-4">
                  <li>
                    <Link href="/faq" className="text-sm text-zinc-550 hover:text-zinc-950">
                      FAQs
                    </Link>
                  </li>
                  <li>
                    <Link href="/contact" className="text-sm text-zinc-550 hover:text-zinc-950">
                      Contact
                    </Link>
                  </li>
                  <li>
                    <Link href="/shipping" className="text-sm text-zinc-550 hover:text-zinc-950">
                      Shipping Info
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="md:grid md:grid-cols-1">
              <div>
                <h3 className="text-sm font-semibold text-zinc-900 tracking-wider">
                  Legal
                </h3>
                <ul role="list" className="mt-4 space-y-4">
                  <li>
                    <Link href="/privacy" className="text-sm text-zinc-550 hover:text-zinc-950">
                      Privacy Policy
                    </Link>
                  </li>
                  <li>
                    <Link href="/terms" className="text-sm text-zinc-550 hover:text-zinc-950">
                      Terms of Service
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>

        </div>
        
        {/* Bottom bar */}
        <div className="mt-12 border-t border-zinc-100 pt-8 lg:mt-16 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-zinc-400">
            &copy; {currentYear} SmartHealth, Inc. All rights reserved.
          </p>
          <p className="text-xs text-zinc-400">
            Designed with scientific integrity.
          </p>
        </div>
      </div>
    </footer>
  );
}
