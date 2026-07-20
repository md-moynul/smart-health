'use client';

import { useState, useEffect, useCallback } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import Link from 'next/link';
import { toast } from 'react-toastify';

type CartItemData = {
  productId: string;
  quantity: number;
};

type ProductInfo = {
  id: string;
  name: string;
  price: number;
  category: string;
  image?: string;
};

type CartItemWithProduct = CartItemData & { product: ProductInfo | null };

function CartContent() {
  const [cartItems, setCartItems] = useState<CartItemWithProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [removing, setRemoving] = useState<string | null>(null);

  const loadCart = useCallback(async () => {
    try {
      setLoading(true);
      // 1. Fetch cart items from DB via Next.js proxy
      const cartRes = await fetch('/api/cart');
      const cartData = await cartRes.json();
      const items: CartItemData[] = cartData.items || [];

      if (items.length === 0) {
        setCartItems([]);
        return;
      }

      // 2. Fetch product details for each item
      const enriched: CartItemWithProduct[] = await Promise.all(
        items.map(async (item) => {
          try {
            const prodRes = await fetch(`/api/products/${item.productId}`);
            if (prodRes.ok) {
              const product = await prodRes.json();
              return { ...item, product };
            }
          } catch {}
          return { ...item, product: null };
        })
      );

      setCartItems(enriched);
    } catch (err) {
      console.error('Failed to load cart:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCart();
  }, [loadCart]);

  const handleRemove = async (productId: string) => {
    setRemoving(productId);
    try {
      await fetch('/api/cart', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId }),
      });
      const removed = cartItems.find((i) => i.productId === productId);
      setCartItems((prev) => prev.filter((i) => i.productId !== productId));
      toast.success(`${removed?.product?.name || 'Item'} removed from cart`);
    } catch (err) {
      console.error('Failed to remove item:', err);
      toast.error('Failed to remove item');
    } finally {
      setRemoving(null);
    }
  };

  const handleUpdateQty = async (productId: string, newQty: number) => {
    if (newQty < 1) return;
    try {
      await fetch('/api/cart', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, quantity: newQty }),
      });
      setCartItems((prev) =>
        prev.map((i) => (i.productId === productId ? { ...i, quantity: newQty } : i))
      );
      toast.success('Quantity updated');
    } catch (err) {
      console.error('Failed to update quantity:', err);
      toast.error('Failed to update quantity');
    }
  };

  const subtotal = cartItems.reduce(
    (acc, item) => acc + (item.product?.price || 0) * item.quantity,
    0
  );
  const tax = subtotal * 0.08;
  const total = subtotal + tax;

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans">
        <div className="flex flex-col items-center space-y-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent" />
          <p className="text-sm font-medium text-zinc-500">Loading your cart…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 font-sans text-zinc-900 pb-16">
      {/* Header */}
      <header className="bg-white border-b border-zinc-150 py-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <Link href="/" className="inline-flex items-center space-x-2">
            <span className="bg-linear-to-r from-emerald-500 to-teal-600 bg-clip-text text-xl font-bold tracking-tight text-transparent">
              SmartHealth
            </span>
          </Link>
          <Link
            href="/products"
            className="text-xs font-semibold text-zinc-500 hover:text-zinc-900 transition-colors"
          >
            ← Continue Shopping
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-10">
        <h1 className="text-2xl font-bold tracking-tight mb-8">Shopping Cart</h1>

        {cartItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <svg className="h-20 w-20 text-zinc-200 mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2 9m5-9v9m4-9v9m5-9l2 9" />
            </svg>
            <h2 className="text-xl font-bold text-zinc-700">Your cart is empty</h2>
            <p className="mt-2 text-sm text-zinc-500">Browse our products and add items to your cart.</p>
            <Link
              href="/products"
              className="mt-6 rounded-full bg-zinc-950 px-6 py-2.5 text-sm font-semibold text-white hover:bg-zinc-800 transition-colors"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
            {/* Cart Items List */}
            <div className="lg:col-span-8 space-y-4">
              <div className="bg-white rounded-3xl border border-zinc-150 p-6 shadow-sm space-y-6">
                {cartItems.map((item) => (
                  <div key={item.productId} className="flex items-center justify-between border-b border-zinc-100 pb-6 last:border-0 last:pb-0">
                    {/* Product Image + Info */}
                    <div className="flex items-center gap-4">
                      <div className="h-16 w-16 rounded-xl bg-zinc-100 border border-zinc-150 overflow-hidden flex items-center justify-center shrink-0">
                        {item.product?.image ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={item.product.image} alt={item.product.name} className="h-full w-full object-cover" />
                        ) : (
                          <svg className="h-8 w-8 text-zinc-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                          </svg>
                        )}
                      </div>
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                          {item.product?.category || 'Product'}
                        </span>
                        <h2 className="text-sm font-semibold text-zinc-900">
                          <Link href={`/products/${item.productId}`} className="hover:text-emerald-600 transition-colors">
                            {item.product?.name || 'Unknown Product'}
                          </Link>
                        </h2>
                        <p className="text-xs text-zinc-500">
                          ৳{(item.product?.price || 0).toFixed(2)} each
                        </p>
                      </div>
                    </div>

                    {/* Quantity + Actions */}
                    <div className="flex items-center gap-4">
                      {/* Qty selector */}
                      <div className="flex items-center rounded-full border border-zinc-200 bg-zinc-50">
                        <button
                          onClick={() => handleUpdateQty(item.productId, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                          className="px-3 py-1.5 text-zinc-500 hover:text-zinc-900 disabled:opacity-30 transition-colors text-sm font-bold"
                        >
                          −
                        </button>
                        <span className="px-2 text-sm font-semibold text-zinc-800 min-w-[1.5rem] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => handleUpdateQty(item.productId, item.quantity + 1)}
                          className="px-3 py-1.5 text-zinc-500 hover:text-zinc-900 transition-colors text-sm font-bold"
                        >
                          +
                        </button>
                      </div>

                      {/* Line total */}
                      <span className="text-sm font-bold text-zinc-950 min-w-[4rem] text-right">
                        ৳{((item.product?.price || 0) * item.quantity).toFixed(2)}
                      </span>

                      {/* Remove */}
                      <button
                        onClick={() => handleRemove(item.productId)}
                        disabled={removing === item.productId}
                        className="p-1.5 rounded-lg text-zinc-400 hover:text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
                        title="Remove"
                      >
                        {removing === item.productId ? (
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-red-400 border-t-transparent" />
                        ) : (
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Cart Summary */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-white rounded-3xl border border-zinc-150 p-6 shadow-sm space-y-6 sticky top-24">
                <h2 className="text-lg font-bold">Order Summary</h2>

                <div className="space-y-3.5 text-sm">
                  <div className="flex justify-between text-zinc-555">
                    <span>Subtotal ({cartItems.reduce((a, i) => a + i.quantity, 0)} items)</span>
                    <span className="font-semibold text-zinc-800">৳{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-zinc-555">
                    <span>Estimated Tax</span>
                    <span className="font-semibold text-zinc-800">৳{tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-zinc-555">
                    <span>Shipping</span>
                    <span className="font-semibold text-emerald-600">Free</span>
                  </div>
                  <div className="border-t border-zinc-100 pt-3.5 flex justify-between text-base font-bold">
                    <span>Total</span>
                    <span className="text-zinc-950">৳{total.toFixed(2)}</span>
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
        )}
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
