'use client';

import { useState, useEffect, useMemo } from 'react';

interface UserRecord {
  id: string;
  name: string;
  email: string;
  image: string;
  role: string;
  createdAt: string | null;
}

export default function UsersManagement() {
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/admin/users');
      const data = await res.json();
      if (Array.isArray(data)) {
        setUsers(data);
      } else {
        setError(data.error || 'Failed to load users');
      }
    } catch (err) {
      setError('Network error fetching users list.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filtered = useMemo(() => {
    return users.filter((u) => {
      return (
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase())
      );
    });
  }, [users, search]);

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return 'N/A';
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-950 sm:text-3xl">Registered Users</h1>
        <p className="text-sm text-zinc-500 mt-1">View and search through registered SmartHealth accounts.</p>
      </div>

      {/* Filter panel */}
      <div className="bg-white border border-zinc-150 rounded-2xl p-4 shadow-2xs">
        <div className="relative">
          <input
            type="text"
            placeholder="Search users by name or email address..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-11 pl-10 pr-4 rounded-xl border border-zinc-200 bg-zinc-50 text-sm focus:bg-white focus:outline-hidden focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all text-zinc-800"
          />
          <svg className="absolute left-3 top-3.5 h-4.5 w-4.5 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* Table grid */}
      {loading ? (
        <div className="bg-white border border-zinc-150 rounded-2xl p-8 space-y-4 animate-pulse">
          <div className="h-6 bg-zinc-200 rounded-md w-1/4" />
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-12 bg-zinc-100 rounded-md w-full" />
            ))}
          </div>
        </div>
      ) : error ? (
        <div className="border border-rose-100 bg-rose-50/50 rounded-2xl p-6 text-center text-rose-700">
          <p>{error}</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white border border-zinc-150 rounded-2xl p-12 text-center text-zinc-550">
          <svg className="mx-auto h-12 w-12 text-zinc-350 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <h3 className="text-sm font-semibold text-zinc-900">No users found</h3>
          <p className="text-xs mt-1">We couldn't find any account matching your search criteria.</p>
        </div>
      ) : (
        <div className="bg-white border border-zinc-150 rounded-2xl shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-zinc-150 text-sm text-left">
              <thead className="bg-zinc-50/50">
                <tr>
                  <th className="px-6 py-4 font-semibold text-zinc-500">User Account</th>
                  <th className="px-6 py-4 font-semibold text-zinc-500">Email Address</th>
                  <th className="px-6 py-4 font-semibold text-zinc-500">Role Authority</th>
                  <th className="px-6 py-4 font-semibold text-zinc-500">Registered Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-150">
                {filtered.map((u) => (
                  <tr key={u.id} className="hover:bg-zinc-50/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="h-9 w-9 rounded-full bg-emerald-50 border border-zinc-200 overflow-hidden flex items-center justify-center flex-shrink-0">
                          {u.image ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={u.image} alt={u.name} className="h-full w-full object-cover" />
                          ) : (
                            <span className="text-sm font-bold text-emerald-700">
                              {u.name ? u.name[0].toUpperCase() : 'U'}
                            </span>
                          )}
                        </div>
                        <span className="font-semibold text-zinc-950">{u.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-zinc-650 font-mono text-xs">{u.email}</td>
                    <td className="px-6 py-4">
                      {u.role === 'admin' ? (
                        <span className="inline-flex items-center rounded-full bg-teal-50 px-2 py-0.5 text-2xs font-semibold text-teal-700 ring-1 ring-inset ring-teal-600/10">
                          Admin
                        </span>
                      ) : (
                        <span className="inline-flex items-center rounded-full bg-zinc-50 px-2 py-0.5 text-2xs font-semibold text-zinc-600 ring-1 ring-inset ring-zinc-500/10">
                          User
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-zinc-500">{formatDate(u.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
