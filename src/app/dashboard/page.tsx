'use client';

import { useState, useEffect } from 'react';
import { authClient } from '@/lib/auth-client';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';

interface DashboardStats {
  totalUsers: number;
  totalMedicines: number;
  outOfStock: number;
  prescriptionsProcessed: number;
}

interface ChartDataPoint {
  name: string;
  Prescriptions: number;
  OTC: number;
  Consultation: number;
}

export default function DashboardOverview() {
  const { data: session } = authClient.useSession();
  const user = session?.user;

  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    async function fetchStats() {
      try {
        const res = await fetch('/api/admin/stats');
        const data = await res.json();
        
        if (data.success) {
          setStats(data.stats);
          setChartData(data.chartData);
        } else {
          setError(data.error || 'Failed to load stats');
        }
      } catch (err: any) {
        setError('Network error loading dashboard stats');
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="h-10 bg-zinc-200 rounded-md w-1/4" />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-28 bg-zinc-100 border border-zinc-150 rounded-2xl p-6" />
          ))}
        </div>
        <div className="h-[380px] bg-zinc-100 border border-zinc-150 rounded-3xl p-6" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-rose-100 bg-rose-50/50 p-6 text-center text-rose-700">
        <svg className="mx-auto h-12 w-12 text-rose-500 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <h3 className="text-lg font-bold">Failed to Load Dashboard</h3>
        <p className="text-sm mt-1">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-950 sm:text-3xl">
          Welcome back, {user?.name?.split(' ')[0] || 'Admin'}
        </h1>
        <p className="text-sm text-zinc-500 mt-1">
          Here is a summary of the SmartHealth system telemetry today.
        </p>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Users */}
        <div className="bg-white border border-zinc-150 rounded-2xl p-6 shadow-2xs hover:shadow-xs transition-shadow flex items-center justify-between">
          <div className="space-y-2">
            <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Total Users</p>
            <p className="text-3xl font-extrabold text-zinc-950">{stats?.totalUsers}</p>
          </div>
          <div className="h-12 w-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
        </div>

        {/* Total Medicines */}
        <div className="bg-white border border-zinc-150 rounded-2xl p-6 shadow-2xs hover:shadow-xs transition-shadow flex items-center justify-between">
          <div className="space-y-2">
            <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Total Medicines</p>
            <p className="text-3xl font-extrabold text-zinc-950">{stats?.totalMedicines}</p>
          </div>
          <div className="h-12 w-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
            </svg>
          </div>
        </div>

        {/* Out of stock */}
        <div className="bg-white border border-zinc-150 rounded-2xl p-6 shadow-2xs hover:shadow-xs transition-shadow flex items-center justify-between">
          <div className="space-y-2">
            <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Out of Stock</p>
            <p className="text-3xl font-extrabold text-zinc-950">{stats?.outOfStock}</p>
          </div>
          <div className="h-12 w-12 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
        </div>

        {/* Prescriptions Processed */}
        <div className="bg-white border border-zinc-150 rounded-2xl p-6 shadow-2xs hover:shadow-xs transition-shadow flex items-center justify-between">
          <div className="space-y-2">
            <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Prescriptions Refills</p>
            <p className="text-3xl font-extrabold text-zinc-950">{stats?.prescriptionsProcessed}</p>
          </div>
          <div className="h-12 w-12 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Analytics Chart Section */}
      <div className="bg-white border border-zinc-150 rounded-3xl p-6 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h2 className="text-lg font-bold text-zinc-950">Activity Analytics</h2>
            <p className="text-xs text-zinc-550">Weekly transaction volumes across product lines.</p>
          </div>
          <div className="flex items-center space-x-4 text-xs font-medium text-zinc-500">
            <div className="flex items-center">
              <div className="h-2 w-2 rounded-full bg-emerald-500 mr-2" />
              <span>Prescriptions</span>
            </div>
            <div className="flex items-center">
              <div className="h-2 w-2 rounded-full bg-cyan-500 mr-2" />
              <span>Over-the-Counter</span>
            </div>
          </div>
        </div>

        <div className="w-full h-[350px]">
          {mounted && chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorPrescriptions" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.01}/>
                  </linearGradient>
                  <linearGradient id="colorOTC" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.01}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f4f4f5" />
                <XAxis
                  dataKey="name"
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  contentStyle={{
                    background: "rgba(255, 255, 255, 0.95)",
                    border: "1px solid #e4e4e7",
                    borderRadius: "16px",
                    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.05)",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="Prescriptions"
                  stroke="#10b981"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#colorPrescriptions)"
                />
                <Area
                  type="monotone"
                  dataKey="OTC"
                  stroke="#06b6d4"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#colorOTC)"
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-zinc-400">
              Initializing graph canvas...
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
