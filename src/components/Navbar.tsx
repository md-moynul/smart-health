'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { authClient } from '@/lib/auth-client';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [avatarOpen, setAvatarOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const avatarRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();

  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  /* Navbar visible on dashboard */
  // Close avatar dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (avatarRef.current && !avatarRef.current.contains(e.target as Node)) {
        setAvatarOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await authClient.signOut();
    setAvatarOpen(false);
    setIsOpen(false);
    setIsLoggingOut(false);
    router.push('/');
    router.refresh();
  };

  // Nav links shown only when authenticated 
  const authLinks = [
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Cart', href: '/cart' },
    { name: 'Orders', href: '/orders' },
    { name: 'Profile', href: '/profile' },
  ];

  // Shared nav links (always visible)
  const publicLinks = [
    { name: 'Home', href: '/' },
    { name: 'Products', href: '/products' },
    { name: 'About', href: '/about' }
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-zinc-100 bg-white/85 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Left side: Logo */}
          <div className="shrink-0">
            <Link href="/" className="flex items-center space-x-2">
              <span className="bg-linear-to-r from-emerald-500 to-teal-600 bg-clip-text text-xl font-bold tracking-tight text-transparent">
                SmartHealth
              </span>
            </Link>
          </div>

          {/* Center: Desktop Navigation Links */}
          <div className="hidden md:flex flex-1 justify-center items-center space-x-8">
            {/* Public links */}
            {publicLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-sm font-medium text-zinc-650 transition-colors hover:text-zinc-950"
              >
                {link.name}
              </Link>
            ))}

            {/* Auth-only links */}
            {!isPending && user && authLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-sm font-medium text-zinc-650 transition-colors hover:text-zinc-950"
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Right side: skeleton → login button / avatar (Desktop only) */}
          <div className="hidden md:flex items-center">
            {isPending ? (
              <div className="h-9 w-9 rounded-full bg-zinc-100 animate-pulse" />
            ) : user ? (
              /* Avatar dropdown */
              <div className="relative" ref={avatarRef}>
                <button
                  id="navbar-avatar-btn"
                  onClick={() => setAvatarOpen((v) => !v)}
                  className="flex items-center focus:outline-none"
                  aria-label="Open user menu"
                >
                  <div className="h-9 w-9 rounded-full ring-2 ring-emerald-400 ring-offset-2 overflow-hidden bg-zinc-200 transition-all hover:ring-emerald-500">
                    {user.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={user.image}
                        alt={user.name ?? 'Avatar'}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span className="flex h-full w-full items-center justify-center bg-linear-to-br from-emerald-400 to-teal-600 text-xs font-bold text-white uppercase">
                        {(user.name ?? user.email ?? 'U').charAt(0)}
                      </span>
                    )}
                  </div>
                </button>

                {/* Dropdown modal */}
                {avatarOpen && (
                  <div
                    id="navbar-user-dropdown"
                    className="absolute right-0 mt-3 w-60 rounded-2xl border border-zinc-100 bg-white shadow-2xl shadow-zinc-200/60 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150"
                  >
                    {/* User info */}
                    <div className="flex items-center gap-3 px-4 py-4 border-b border-zinc-100">
                      <div className="h-10 w-10 rounded-full overflow-hidden bg-zinc-200 shrink-0">
                        {user.image ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={user.image} alt={user.name ?? 'Avatar'} className="h-full w-full object-cover" />
                        ) : (
                          <span className="flex h-full w-full items-center justify-center bg-linear-to-br from-emerald-400 to-teal-600 text-sm font-bold text-white uppercase">
                            {(user.name ?? user.email ?? 'U').charAt(0)}
                          </span>
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-zinc-900 truncate">{user.name ?? 'User'}</p>
                        <p className="text-xs text-zinc-400 truncate">{user.email}</p>
                      </div>
                    </div>

                    {/* Links inside dropdown */}
                    <div className="py-2 px-2">
                      <Link
                        href="/dashboard"
                        onClick={() => setAvatarOpen(false)}
                        className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 transition-colors"
                      >
                        <svg className="h-4 w-4 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                        Dashboard
                      </Link>
                      <Link
                        href="/cart"
                        onClick={() => setAvatarOpen(false)}
                        className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 transition-colors"
                      >
                        <svg className="h-4 w-4 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2 9m5-9v9m4-9v9m5-9l2 9" />
                        </svg>
                        Cart
                      </Link>
                    </div>

                    {/* Logout */}
                    <div className="border-t border-zinc-100 p-2">
                      <button
                        id="navbar-logout-btn"
                        onClick={handleLogout}
                        disabled={isLoggingOut}
                        className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
                      >
                        {isLoggingOut ? (
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-red-400 border-t-transparent" />
                        ) : (
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                          </svg>
                        )}
                        {isLoggingOut ? 'Signing out…' : 'Sign out'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Not logged in */
              <Link
                href="/login"
                className="rounded-full bg-zinc-950 px-4 py-2 text-xs font-semibold text-white transition-all hover:bg-zinc-800"
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center gap-3">
            {/* Show mini avatar on mobile when logged in */}
            {!isPending && user && (
              <div className="h-8 w-8 rounded-full overflow-hidden bg-zinc-200 ring-2 ring-emerald-400">
                {user.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={user.image} alt="Avatar" className="h-full w-full object-cover" />
                ) : (
                  <span className="flex h-full w-full items-center justify-center bg-linear-to-br from-emerald-400 to-teal-600 text-xs font-bold text-white uppercase">
                    {(user.name ?? user.email ?? 'U').charAt(0)}
                  </span>
                )}
              </div>
            )}
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className="inline-flex items-center justify-center rounded-md p-2 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-800 focus:outline-none"
              aria-controls="mobile-menu"
              aria-expanded={isOpen}
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="border-b border-zinc-100 bg-white/95 px-4 pt-2 pb-4 shadow-lg md:hidden">
          <div className="space-y-1 px-2 pt-2 pb-3 sm:px-3">
            {/* Public links */}
            {publicLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="block rounded-md px-3 py-2 text-base font-medium text-zinc-600 hover:bg-zinc-50 hover:text-zinc-950"
              >
                {link.name}
              </Link>
            ))}

            {/* Auth-only links */}
            {!isPending && user && authLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="block rounded-md px-3 py-2 text-base font-medium text-zinc-600 hover:bg-zinc-50 hover:text-zinc-950"
              >
                {link.name}
              </Link>
            ))}

            <div className="pt-4 border-t border-zinc-100">
              {!isPending && user ? (
                <>
                  {/* Logged-in: user info + logout */}
                  <div className="flex items-center gap-3 px-3 py-2 mb-2">
                    <div className="h-9 w-9 rounded-full overflow-hidden bg-zinc-200 shrink-0">
                      {user.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={user.image} alt="Avatar" className="h-full w-full object-cover" />
                      ) : (
                        <span className="flex h-full w-full items-center justify-center bg-linear-to-br from-emerald-400 to-teal-600 text-sm font-bold text-white uppercase">
                          {(user.name ?? user.email ?? 'U').charAt(0)}
                        </span>
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-zinc-900 truncate">{user.name}</p>
                      <p className="text-xs text-zinc-400 truncate">{user.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    className="flex w-full items-center justify-center gap-2 rounded-full border border-red-200 py-3 text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
                  >
                    {isLoggingOut ? (
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-red-400 border-t-transparent" />
                    ) : null}
                    {isLoggingOut ? 'Signing out…' : 'Sign out'}
                  </button>
                </>
              ) : (
                /* Logged out */
                <Link
                  href="/login"
                  onClick={() => setIsOpen(false)}
                  className="block w-full rounded-full bg-zinc-950 py-3 text-center text-sm font-semibold text-white transition-all hover:bg-zinc-800"
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}