'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ProductCard from './ProductCard';
import type { Product } from '@/lib/products';

export default function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getProducts() {
      try {
        const res = await fetch('/api/products/featured');
        const data = await res.json();
        if (data && Array.isArray(data.products)) {
          setProducts(data.products);
        } else if (Array.isArray(data)) {
          setProducts(data);
        }
      } catch (err) {
        console.error('Error fetching featured products:', err);
      } finally {
        setLoading(false);
      }
    }
    getProducts();
  }, []);

  const featured = products;

  return (
    <section className="bg-white py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row sm:items-end">
          <div className="text-center sm:text-left">
            <h2 className="text-3xl font-bold tracking-tight text-zinc-950 sm:text-4xl">
              Featured Products
            </h2>
            <p className="mt-4 text-base text-zinc-600 max-w-xl">
              Engineered for precision, purity, and results. Explore our top-rated recommendations.
            </p>
          </div>
          <Link
            href="/products"
            className="group inline-flex items-center text-sm font-semibold text-emerald-600"
          >
            View All Products
            <svg
              className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {loading ? (
            [...Array(4)].map((_, i) => (
              <div key={i} className="rounded-2xl border border-zinc-100 bg-white p-4 shadow-sm space-y-4 animate-pulse">
                <div className="aspect-square w-full rounded-xl bg-zinc-100" />
                <div className="h-4 bg-zinc-100 rounded-md w-1/4" />
                <div className="space-y-2">
                  <div className="h-5 bg-zinc-200 rounded-md w-3/4" />
                  <div className="h-4 bg-zinc-100 rounded-md w-1/2" />
                </div>
                <div className="flex items-center justify-between pt-2">
                  <div className="h-6 bg-zinc-200 rounded-md w-1/5" />
                  <div className="h-9 bg-zinc-150 rounded-full w-20" />
                </div>
              </div>
            ))
          ) : (
            featured.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                name={product.name}
                genericName={product.genericName}
                price={product.price}
                category={product.category}
                image={product.image}
                rating={product.rating}
                reviewCount={product.reviewCount}
                badge={product.badge}
                inStock={product.inStock}
                requiresPrescription={product.requiresPrescription}
              />
            ))
          )}
        </div>
      </div>
    </section>
  );
}
