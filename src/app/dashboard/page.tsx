'use client';

import ProtectedRoute from '@/components/ProtectedRoute';
import { authClient } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';

function DashboardContent() {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const user = session?.user;

  const handleLogout = async () => {
    await authClient.signOut();
    router.push('/login');
    router.refresh();
  };

  const orders = [
    { id: 'RX-98212', drug: 'Lipitor 10mg', quantity: '30 Tablets', date: 'Jul 15, 2026', status: 'Delivered' },
    { id: 'RX-42991', drug: 'Ventolin Inhaler', quantity: '2 Inhalers', date: 'Jul 10, 2026', status: 'Delivered' },
  ];

  return (
    <div className="min-h-screen bg-zinc-50 font-sans text-zinc-900 pb-16">
      {/* Top Header */}
      <header className="bg-white border-b border-zinc-150 py-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="h-16 w-16 rounded-full bg-emerald-50 border border-zinc-200 overflow-hidden flex items-center justify-center">
              {user?.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={user.image} alt={user.name} className="h-full w-full object-cover" />
              ) : (
                <span className="text-xl font-bold text-emerald-700">
                  {user?.name ? user.name[0].toUpperCase() : 'U'}
                </span>
              )}
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-zinc-900">
                Welcome back, {user?.name || 'User'}
              </h1>
              <p className="text-sm text-zinc-500">{user?.email}</p>
            </div>
          </div>
          
          <button
            onClick={handleLogout}
            className="rounded-full border border-zinc-250 bg-white px-4 py-2 text-xs font-semibold text-zinc-700 hover:bg-zinc-50 transition-colors"
          >
            Sign Out
          </button>
        </div>
      </header>

      {/* Main dashboard content */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-10">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          
          {/* Left panel: Quick Actions */}
          <div className="md:col-span-1 space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-zinc-150 shadow-sm space-y-4">
              <h2 className="text-lg font-bold">Quick Actions</h2>
              <div className="flex flex-col gap-2">
                <button className="w-full text-left rounded-xl bg-emerald-50 hover:bg-emerald-100/70 p-3.5 transition-colors text-emerald-950 font-medium text-sm flex justify-between items-center">
                  <span>Refill Active Prescription</span>
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                </button>
                <button className="w-full text-left rounded-xl bg-zinc-50 hover:bg-zinc-100 p-3.5 transition-colors text-zinc-800 font-medium text-sm flex justify-between items-center">
                  <span>Consult with Pharmacist</span>
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                </button>
                <button className="w-full text-left rounded-xl bg-zinc-50 hover:bg-zinc-100 p-3.5 transition-colors text-zinc-800 font-medium text-sm flex justify-between items-center">
                  <span>Insurance Details</span>
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                </button>
              </div>
            </div>
          </div>

          {/* Right panel: Prescription Orders & History */}
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-zinc-150 shadow-sm">
              <h2 className="text-lg font-bold mb-4">Recent Prescriptions</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-zinc-150 text-sm">
                  <thead>
                    <tr>
                      <th className="px-4 py-3 text-left font-semibold text-zinc-500">Order ID</th>
                      <th className="px-4 py-3 text-left font-semibold text-zinc-500">Medication</th>
                      <th className="px-4 py-3 text-left font-semibold text-zinc-500">Quantity</th>
                      <th className="px-4 py-3 text-left font-semibold text-zinc-500">Date</th>
                      <th className="px-4 py-3 text-right font-semibold text-zinc-500">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-150">
                    {orders.map((order) => (
                      <tr key={order.id}>
                        <td className="px-4 py-4 font-mono font-medium text-zinc-650">{order.id}</td>
                        <td className="px-4 py-4 font-semibold">{order.drug}</td>
                        <td className="px-4 py-4 text-zinc-500">{order.quantity}</td>
                        <td className="px-4 py-4 text-zinc-500">{order.date}</td>
                        <td className="px-4 py-4 text-right">
                          <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-inset ring-emerald-600/10">
                            {order.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}
