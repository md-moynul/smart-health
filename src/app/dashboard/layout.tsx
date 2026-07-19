'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { authClient } from '@/lib/auth-client';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { data: session, isPending } = authClient.useSession();
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const user = session?.user;
  const isAdmin = user?.role === 'admin';

  const handleLogout = async () => {
    await authClient.signOut();
    router.push('/login');
    router.refresh();
  };

  if (isPending) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans">
        <div className="flex flex-col items-center space-y-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent" />
          <p className="text-sm font-medium text-zinc-500">Checking administrator privileges...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    if (typeof window !== 'undefined') {
      router.push(`/login?callbackUrl=${encodeURIComponent(pathname)}`);
    }
    return null;
  }

  // Deny access if user is logged in but is not an admin
  if (!isAdmin) {
    return (
      <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-white px-6 py-24 sm:py-32 lg:px-8">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(45rem_50rem_at_top,var(--color-rose-50),white)] opacity-60" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 w-75 h-75 sm:w-125 sm:h-125 rounded-full bg-linear-to-tr from-rose-100/20 to-orange-100/20 blur-3xl" />
        <div className="mx-auto max-w-md text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-rose-50 border border-rose-100 shadow-sm text-rose-600 animate-[bounce_3s_infinite]">
            <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="mt-6 text-2xl font-bold tracking-tight text-zinc-950">Admin Portal Restricted</h1>
          <p className="mt-3 text-sm text-zinc-550">
            Access to this section is restricted to administrators. Your account ({user?.email}) does not have admin role permissions.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/" className="w-full sm:w-auto inline-flex h-11 items-center justify-center rounded-full bg-zinc-950 px-6 text-xs font-semibold text-white hover:bg-zinc-800 transition-colors">
              Return Home
            </Link>
            <button
              onClick={handleLogout}
              className="w-full sm:w-auto inline-flex h-11 items-center justify-center rounded-full border border-zinc-200 bg-white px-6 text-xs font-semibold text-zinc-700 hover:bg-zinc-50 transition-colors"
            >
              Sign In as Admin
            </button>
          </div>
        </div>
      </main>
    );
  }

  const menuItems = [
    {
      name: 'Overview',
      href: '/dashboard',
      icon: (active: boolean) => (
        <svg className={`h-5 w-5 ${active ? 'text-emerald-600' : 'text-zinc-400 group-hover:text-zinc-650'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4zM14 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2v-4z" />
        </svg>
      ),
    },
    {
      name: 'Medicines',
      href: '/dashboard/medicines',
      icon: (active: boolean) => (
        <svg className={`h-5 w-5 ${active ? 'text-emerald-600' : 'text-zinc-400 group-hover:text-zinc-650'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
        </svg>
      ),
    },
    {
      name: 'Add Product',
      href: '/dashboard/add-product',
      icon: (active: boolean) => (
        <svg className={`h-5 w-5 ${active ? 'text-emerald-600' : 'text-zinc-400 group-hover:text-zinc-650'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      name: 'Users',
      href: '/dashboard/users',
      icon: (active: boolean) => (
        <svg className={`h-5 w-5 ${active ? 'text-emerald-600' : 'text-zinc-400 group-hover:text-zinc-650'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="flex h-screen bg-zinc-50 font-sans text-zinc-900 overflow-hidden">
      
      {/* ─── DESKTOP SIDEBAR ─── */}
      <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 border-r border-zinc-150 bg-white">
        <div className="flex flex-col grow pt-5 pb-4 overflow-y-auto">
          {/* Logo */}
          <div className="flex items-center shrink-0 px-6">
            <Link href="/" className="flex items-center space-x-2">
              <span className="bg-linear-to-r from-emerald-500 to-teal-600 bg-clip-text text-xl font-bold tracking-tight text-transparent">
                SmartHealth Admin
              </span>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="mt-8 flex-1 px-4 space-y-1">
            {menuItems.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all ${
                    active
                      ? 'bg-emerald-50 text-emerald-950 font-semibold'
                      : 'text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900'
                  }`}
                >
                  <span className="mr-3">{item.icon(active)}</span>
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User profile section at the bottom of sidebar */}
        <div className="shrink-0 flex border-t border-zinc-150 p-4">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center space-x-3">
              <div className="h-9 w-9 rounded-full bg-emerald-50 border border-zinc-200 overflow-hidden flex items-center justify-center shrink-0">
                {user?.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={user.image} alt={user.name} className="h-full w-full object-cover" />
                ) : (
                  <span className="text-sm font-bold text-emerald-700">
                    {user?.name ? user.name[0].toUpperCase() : 'A'}
                  </span>
                )}
              </div>
              <div className="truncate max-w-27.5">
                <p className="text-xs font-semibold text-zinc-900 truncate">{user?.name || 'Admin'}</p>
                <p className="text-[10px] font-medium text-emerald-600 uppercase tracking-wider">Admin</p>
              </div>
            </div>
            
            <button
              onClick={handleLogout}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
              title="Sign Out"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </div>
      </aside>

      {/* ─── MOBILE HEADER & SIDEBAR ─── */}
      <div className="flex flex-col flex-1 overflow-hidden lg:pl-64">
        
        {/* Mobile Header bar */}
        <header className="lg:hidden flex items-center justify-between bg-white border-b border-zinc-150 h-16 px-4 shrink-0 z-20">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-md text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 transition-colors"
          >
            <span className="sr-only">Open sidebar</span>
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          
          <div className="font-bold text-lg bg-linear-to-r from-emerald-500 to-teal-600 bg-clip-text text-transparent">
            SmartHealth Admin
          </div>

          <div className="h-8 w-8 rounded-full bg-emerald-50 border border-zinc-200 overflow-hidden flex items-center justify-center">
            {user?.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={user.image} alt={user.name} className="h-full w-full object-cover" />
            ) : (
              <span className="text-xs font-bold text-emerald-700">{user?.name ? user.name[0].toUpperCase() : 'A'}</span>
            )}
          </div>
        </header>

        {/* Mobile Sidebar overlay */}
        {mobileMenuOpen && (
          <div className="relative z-40 lg:hidden">
            <div className="fixed inset-0 bg-zinc-600/30 backdrop-blur-xs transition-opacity" onClick={() => setMobileMenuOpen(false)} />
            
            <div className="fixed inset-y-0 left-0 flex flex-col w-64 bg-white border-r border-zinc-150 pt-5 pb-4">
              <div className="flex items-center justify-between px-6">
                <span className="bg-linear-to-r from-emerald-500 to-teal-600 bg-clip-text text-lg font-bold tracking-tight text-transparent">
                  SmartHealth Admin
                </span>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-zinc-100 text-zinc-500 hover:text-zinc-900 transition-colors"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <nav className="mt-8 grow px-4 space-y-1">
                {menuItems.map((item) => {
                  const active = pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all ${
                        active
                          ? 'bg-emerald-50 text-emerald-950 font-semibold'
                          : 'text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900'
                      }`}
                    >
                      <span className="mr-3">{item.icon(active)}</span>
                      {item.name}
                    </Link>
                  );
                })}
              </nav>

              <div className="border-t border-zinc-150 p-4 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="h-8 w-8 rounded-full bg-emerald-50 border border-zinc-200 overflow-hidden flex items-center justify-center">
                    {user?.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={user.image} alt={user.name} className="h-full w-full object-cover" />
                    ) : (
                      <span className="text-xs font-bold text-emerald-700">{user?.name ? user.name[0].toUpperCase() : 'A'}</span>
                    )}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-zinc-900">{user?.name || 'Admin'}</p>
                    <p className="text-[10px] text-zinc-400">Administrator</p>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-1.5 text-zinc-400 hover:text-rose-600 transition-colors"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ─── MAIN CONTENT CONTAINER ─── */}
        <main className="flex-1 relative overflow-y-auto focus:outline-none p-6 sm:p-8">
          <div className="mx-auto max-w-7xl">
            {children}
          </div>
        </main>

      </div>
    </div>
  );
}
