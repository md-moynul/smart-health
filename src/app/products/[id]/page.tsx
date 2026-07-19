'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ALL_PRODUCTS } from '@/lib/products';
import { authClient } from '@/lib/auth-client';
import ProductCard from '@/components/ProductCard';

function StarRating({ rating, reviewCount }: { rating: number; reviewCount: number }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`h-4 w-4 ${
              star <= Math.floor(rating) ? 'fill-amber-400 text-amber-400' : 'fill-zinc-200 text-zinc-200'
            }`}
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
      <span className="text-sm font-semibold text-zinc-700">{rating.toFixed(1)}</span>
      <span className="text-sm text-zinc-400">({reviewCount} reviews)</span>
    </div>
  );
}


function PharmacyIcon({ category, large = false }: { category: string; large?: boolean }) {
  const size = large ? 'w-28 h-28' : 'w-16 h-16';
  switch (category) {
    case 'Pain Relief':
      return <svg className={`${size} text-rose-400`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" /><line x1="4.22" y1="4.22" x2="19.78" y2="19.78" strokeLinecap="round" strokeWidth={2} /><circle cx="8.5" cy="8.5" r="1.5" fill="currentColor" /><circle cx="15.5" cy="15.5" r="1.5" fill="currentColor" /></svg>;
    case 'Antibiotics':
      return <svg className={`${size} text-teal-500`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path d="M9 3h6l1 3H8L9 3z" strokeLinejoin="round" /><path d="M8 6v11a3 3 0 003 3h2a3 3 0 003-3V6" strokeLinejoin="round" /><line x1="8" y1="11" x2="16" y2="11" strokeDasharray="2 2" /></svg>;
    case 'Allergy & Sinus':
      return <svg className={`${size} text-sky-400`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3 12a9 9 0 1118 0 9 9 0 01-18 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M9 10c0-.55.45-1 1-1h4c.55 0 1 .45 1 1M8 14h8" /></svg>;
    case 'Diabetes Care':
      return <svg className={`${size} text-violet-400`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 3h6v2l1 1v12a2 2 0 01-2 2H10a2 2 0 01-2-2V6l1-1V3z" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4M10 12h4" /></svg>;
    case 'Heart & Blood Pressure':
      return <svg className={`${size} text-red-400`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2 12h3l2-3 2 6 2-4 1 2h3" strokeWidth={1.2} /></svg>;
    case 'Digestive Health':
      return <svg className={`${size} text-amber-400`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 3c-1.5 0-3 1-3 2.5 0 2 2 3 2 5s-2 3-2 5c0 1.5 1.5 2.5 3 2.5s3-1 3-2.5c0-2-2-3-2-5s2-3 2-5C15 4 13.5 3 12 3z" /></svg>;
    case 'Vitamins & Supplements':
      return <svg className={`${size} text-emerald-400`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><circle cx="12" cy="12" r="9" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4M12 16h.01" strokeWidth={2.5} /></svg>;
    case 'Cold & Flu':
      return <svg className={`${size} text-cyan-400`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" /><path strokeLinecap="round" strokeLinejoin="round" d="M18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z" /></svg>;
    case 'Skin & Dermatology':
      return <svg className={`${size} text-orange-400`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path d="M8 2h8l2 4H6L8 2z" strokeLinejoin="round" /><rect x="5" y="6" width="14" height="14" rx="3" /><path strokeLinecap="round" d="M9 12c1 2 5 2 6 0" /></svg>;
    case 'Eye & Ear Care':
      return <svg className={`${size} text-indigo-400`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
    case 'Medical Devices':
      return <svg className={`${size} text-zinc-400`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><rect x="3" y="4" width="18" height="13" rx="2" /><path strokeLinecap="round" strokeLinejoin="round" d="M7 10l2 2 2-3 2 3.5 1-1.5h2" strokeWidth={2} /><path strokeLinecap="round" d="M8 20h8M12 17v3" /></svg>;
    default:
      return <svg className={`${size} text-emerald-400`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>;
  }
}


export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = authClient.useSession();

  const product = ALL_PRODUCTS.find((p) => p.id === params.id);

  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  if (!product) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 font-sans text-center px-4">
        <svg className="h-20 w-20 text-zinc-200 mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h1 className="text-2xl font-bold text-zinc-800">Product Not Found</h1>
        <p className="mt-2 text-sm text-zinc-500">The product you&apos;re looking for doesn&apos;t exist.</p>
        <Link
          href="/products"
          className="mt-6 rounded-full bg-zinc-950 px-6 py-2.5 text-sm font-semibold text-white hover:bg-zinc-800 transition-colors"
        >
          Back to Products
        </Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    if (!session) {
      router.push(`/login?callbackUrl=/products/${product.id}`);
      return;
    }
    // Cart logic: store in localStorage for now
    const existing = JSON.parse(localStorage.getItem('cart') || '[]') as Array<{ id: string; quantity: number }>;
    const idx = existing.findIndex((i) => i.id === product.id);
    if (idx >= 0) {
      existing[idx].quantity += quantity;
    } else {
      existing.push({ id: product.id, quantity });
    }
    localStorage.setItem('cart', JSON.stringify(existing));
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  };

  const relatedProducts = ALL_PRODUCTS.filter(
    (p) => p.category === product.category && p.id !== product.id
  ).slice(0, 4);

  return (
    <div className="min-h-screen bg-zinc-50 font-sans pb-20">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-zinc-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3.5">
          <nav className="flex items-center gap-1.5 text-xs text-zinc-400">
            <Link href="/" className="hover:text-zinc-700 transition-colors">Home</Link>
            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
            <Link href="/products" className="hover:text-zinc-700 transition-colors">Products</Link>
            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
            <span className="text-zinc-600 font-medium line-clamp-1">{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8">
        {/* Main Product Section */}
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
          {/* Product Image */}
          <div className="relative flex items-center justify-center rounded-3xl border border-zinc-150 bg-zinc-50 p-12 min-h-[340px]">
            {product.requiresPrescription && (
              <span className="absolute top-4 left-4 rounded-full bg-blue-600 px-3 py-1 text-[11px] font-bold tracking-wider text-white uppercase">Rx Only</span>
            )}
            {product.badge && product.badge !== 'Rx Only' && (
              <span className="absolute top-4 right-4 rounded-full bg-zinc-900 px-3 py-1 text-[11px] font-semibold tracking-wider text-white uppercase">{product.badge}</span>
            )}
            <div className="flex flex-col items-center gap-6">
              <PharmacyIcon category={product.category} large />
              <span className="text-xs font-semibold uppercase tracking-widest text-zinc-400">{product.category}</span>
            </div>
          </div>

          {/* Product Info */}
          <div className="flex flex-col justify-center">
            <span className="text-xs font-semibold uppercase tracking-widest text-emerald-600">
              {product.category}
            </span>
            <h1 className="mt-2 text-2xl font-bold tracking-tight text-zinc-950 sm:text-3xl leading-tight">
              {product.name}
            </h1>
            {product.genericName && (
              <p className="mt-1 text-sm italic text-zinc-400">Generic: {product.genericName}</p>
            )}
            <p className="mt-0.5 text-xs text-zinc-400">By {product.manufacturer}</p>

            <div className="mt-3">
              <StarRating rating={product.rating} reviewCount={product.reviewCount} />
            </div>

            <div className="mt-4 flex items-end gap-4">
              <span className="text-3xl font-bold text-zinc-950">${product.price.toFixed(2)}</span>
              {product.inStock ? (
                <span className="inline-flex items-center gap-1.5 pb-0.5 text-sm font-semibold text-emerald-600">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  In Stock
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 pb-0.5 text-sm font-semibold text-zinc-400">
                  <span className="h-2 w-2 rounded-full bg-zinc-300" />
                  Out of Stock
                </span>
              )}
            </div>

            {/* Prescription warning */}
            {product.requiresPrescription && (
              <div className="mt-4 flex items-start gap-2.5 rounded-xl border border-blue-100 bg-blue-50 px-4 py-3">
                <svg className="mt-0.5 h-4 w-4 flex-shrink-0 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="text-xs font-medium text-blue-800">
                  <span className="font-bold">Prescription required.</span> A valid prescription from a licensed healthcare provider must be submitted before this item is dispensed.
                </p>
              </div>
            )}

            <p className="mt-5 text-sm leading-relaxed text-zinc-600">{product.description}</p>

            {/* Dosage Instructions */}
            {product.dosage && (
              <div className="mt-4 rounded-xl border border-zinc-150 bg-zinc-50 px-4 py-3">
                <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1">Dosage &amp; Administration</p>
                <p className="text-sm font-medium text-zinc-700">{product.dosage}</p>
              </div>
            )}

            <div className="mt-5 space-y-1.5">
              {product.details.map((detail, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <svg className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-sm text-zinc-600">{detail}</span>
                </div>
              ))}
            </div>

            {/* Add to Cart Section */}
            <div className="mt-8 space-y-4">
              {/* Not logged in warning */}
              {!session && (
                <div className="flex items-center gap-2.5 rounded-xl bg-amber-50 border border-amber-100 px-4 py-3">
                  <svg className="h-4 w-4 flex-shrink-0 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                  </svg>
                  <p className="text-xs font-medium text-amber-700">
                    You must{' '}
                    <Link href={`/login?callbackUrl=/products/${product.id}`} className="underline underline-offset-2 font-semibold hover:text-amber-900">
                      sign in
                    </Link>{' '}
                    to add items to your cart.
                  </p>
                </div>
              )}

              <div className="flex items-center gap-3">
                {/* Quantity Selector */}
                <div className="flex items-center rounded-xl border border-zinc-200 bg-white overflow-hidden">
                  <button
                    id="qty-decrease"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={quantity <= 1}
                    className="flex h-11 w-11 items-center justify-center text-zinc-500 transition-colors hover:bg-zinc-50 hover:text-zinc-900 disabled:opacity-30 disabled:cursor-not-allowed"
                    aria-label="Decrease quantity"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
                    </svg>
                  </button>
                  <span id="qty-display" className="w-10 text-center text-sm font-bold text-zinc-900">
                    {quantity}
                  </span>
                  <button
                    id="qty-increase"
                    onClick={() => setQuantity((q) => Math.min(99, q + 1))}
                    className="flex h-11 w-11 items-center justify-center text-zinc-500 transition-colors hover:bg-zinc-50 hover:text-zinc-900"
                    aria-label="Increase quantity"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                  </button>
                </div>

                {/* Add to Cart Button */}
                <button
                  id="add-to-cart-btn"
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                  className={`flex-1 flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold transition-all ${
                    added
                      ? 'bg-emerald-500 text-white'
                      : !product.inStock
                      ? 'bg-zinc-100 text-zinc-400 cursor-not-allowed'
                      : !session
                      ? 'bg-zinc-950 text-white hover:bg-emerald-600'
                      : 'bg-zinc-950 text-white hover:bg-emerald-600'
                  }`}
                >
                  {added ? (
                    <>
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      Added to Cart!
                    </>
                  ) : !session ? (
                    <>
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                      </svg>
                      Sign In to Add to Cart
                    </>
                  ) : (
                    <>
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                      </svg>
                      Add to Cart · ${(product.price * quantity).toFixed(2)}
                    </>
                  )}
                </button>
              </div>

              {/* View Cart shortcut */}
              {session && (
                <Link
                  href="/cart"
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-white py-3 text-sm font-semibold text-zinc-700 transition-colors hover:border-zinc-300 hover:bg-zinc-50"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  View Cart
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-xl font-bold tracking-tight text-zinc-950 mb-6">
              More in{' '}
              <span className="text-emerald-600">{product.category}</span>
            </h2>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {relatedProducts.map((p) => (
                <ProductCard
                  key={p.id}
                  id={p.id}
                  name={p.name}
                  genericName={p.genericName}
                  price={p.price}
                  category={p.category}
                  image={p.image}
                  rating={p.rating}
                  reviewCount={p.reviewCount}
                  badge={p.badge}
                  inStock={p.inStock}
                  requiresPrescription={p.requiresPrescription}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
