'use client';

import ProtectedRoute from '@/components/ProtectedRoute';
import Link from 'next/link';

function CartContent() {
  const cartItems = [
    { id: '1', name: 'Automatic Blood Pressure Monitor', price: 59.99, quantity: 1, category: 'Diagnostics' },
    { id: '3', name: 'Allergy Defense Non-Drowsy (30 Tab)', price: 18.99, quantity: 2, category: 'OTC Medicine' },
  ];

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const tax = subtotal * 0.08;
  const shipping = 0; // Free
  const total = subtotal + tax + shipping;

  return (
    <div className="min-h-screen bg-zinc-50 font-sans text-zinc-900 pb-16">
      {/* Header */}
      <header className="bg-white border-b border-zinc-150 py-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <Link href="/" className="inline-flex items-center space-x-2">
            <span className="bg-gradient-to-r from-emerald-500 to-teal-600 bg-clip-text text-xl font-bold tracking-tight text-transparent">
              SmartHealth
            </span>
          </Link>
          <Link
            href="/"
            className="text-xs font-semibold text-zinc-500 hover:text-zinc-900 transition-colors"
          >
            Back to Shop
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-10">
        <h1 className="text-2xl font-bold tracking-tight mb-8">Shopping Cart</h1>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Cart Items List */}
          <div className="lg:col-span-8 space-y-4">
            <div className="bg-white rounded-3xl border border-zinc-150 p-6 shadow-sm space-y-6">
              {cartItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between border-b border-zinc-100 pb-6 last:border-0 last:pb-0">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">{item.category}</span>
                    <h2 className="text-sm font-semibold text-zinc-900">{item.name}</h2>
                    <p className="text-xs text-zinc-500">Qty: {item.quantity}</p>
                  </div>
                  <div className="text-right space-y-1">
                    <span className="text-sm font-bold text-zinc-950">${(item.price * item.quantity).toFixed(2)}</span>
                    <button className="block text-[11px] font-semibold text-red-500 hover:text-red-650 transition-colors ml-auto">
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Cart Summary */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-3xl border border-zinc-150 p-6 shadow-sm space-y-6">
              <h2 className="text-lg font-bold">Order Summary</h2>
              
              <div className="space-y-3.5 text-sm">
                <div className="flex justify-between text-zinc-555">
                  <span>Subtotal</span>
                  <span className="font-semibold text-zinc-800">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-zinc-555">
                  <span>Estimated Tax</span>
                  <span className="font-semibold text-zinc-800">${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-zinc-555">
                  <span>Shipping</span>
                  <span className="font-semibold text-emerald-600">Free</span>
                </div>
                <div className="border-t border-zinc-100 pt-3.5 flex justify-between text-base font-bold">
                  <span>Total</span>
                  <span className="text-zinc-950">${total.toFixed(2)}</span>
                </div>
              </div>

              <button
                type="button"
                className="w-full rounded-full bg-zinc-950 py-3.5 text-sm font-semibold text-white shadow-sm hover:bg-zinc-800 transition-colors"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function CartPage() {
  return (
    <ProtectedRoute>
      <CartContent />
    </ProtectedRoute>
  );
}
