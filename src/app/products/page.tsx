'use client';

import { useState, useEffect } from 'react';
import ProductCard from '@/components/ProductCard';
import { CATEGORIES, Product } from '@/lib/products';

const PRODUCTS_PER_PAGE = 8;

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState<'default' | 'price-asc' | 'price-desc' | 'rating'>('default');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    async function getProducts() {
      try {
        setLoading(true);
        const queryParams = new URLSearchParams();
        if (search.trim()) queryParams.set("search", search);
        if (selectedCategory !== "All") queryParams.set("category", selectedCategory);
        if (sortBy !== "default") queryParams.set("sort", sortBy);

        const res = await fetch(`/api/products?${queryParams.toString()}`);
        const data = await res.json();
        if (Array.isArray(data)) {
          setProducts(data);
        }
      } catch (err) {
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    }
    getProducts();
  }, [search, selectedCategory, sortBy]);

  const filtered = products;

  const totalPages = Math.max(1, Math.ceil(filtered.length / PRODUCTS_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);
  const paginated = filtered.slice((safePage - 1) * PRODUCTS_PER_PAGE, safePage * PRODUCTS_PER_PAGE);

  const handleSearch = (val: string) => {
    setSearch(val);
    setCurrentPage(1);
  };

  const handleCategory = (cat: string) => {
    setSelectedCategory(cat);
    setCurrentPage(1);
  };

  const handleSort = (val: typeof sortBy) => {
    setSortBy(val);
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-zinc-50 font-sans">
      {/* Page Header */}
      <div className="bg-white border-b border-zinc-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
          <h1 className="text-3xl font-bold tracking-tight text-zinc-950 sm:text-4xl">All Products</h1>
          <p className="mt-2 text-sm text-zinc-500">
            Explore our full range of health and wellness products.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Search & Sort Bar */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-6">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
              <svg className="h-4 w-4 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z" />
              </svg>
            </div>
            <input
              id="product-search"
              type="text"
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search products..."
              className="block w-full rounded-xl border border-zinc-200 bg-white py-2.5 pl-10 pr-4 text-sm text-zinc-900 placeholder-zinc-400 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
            {search && (
              <button
                onClick={() => handleSearch('')}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-zinc-400 hover:text-zinc-700"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          {/* Sort */}
          <div className="flex items-center gap-2">
            <label htmlFor="sort-select" className="text-xs font-semibold text-zinc-500 whitespace-nowrap">Sort by</label>
            <select
              id="sort-select"
              value={sortBy}
              onChange={(e) => handleSort(e.target.value as typeof sortBy)}
              className="rounded-xl border border-zinc-200 bg-white py-2.5 pl-3 pr-8 text-sm text-zinc-700 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 cursor-pointer"
            >
              <option value="default">Featured</option>
              <option value="rating">Top Rated</option>
              <option value="price-asc">Price: Low → High</option>
              <option value="price-desc">Price: High → Low</option>
            </select>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap gap-2 mb-8">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              id={`filter-${cat.replace(/\s+/g, '-').replace(/&/g, 'and').toLowerCase()}`}
              onClick={() => handleCategory(cat)}
              className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-zinc-950 text-white shadow-sm'
                  : 'bg-white border border-zinc-200 text-zinc-600 hover:border-zinc-300 hover:text-zinc-900'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Results Summary */}
        <div className="mb-5 flex items-center justify-between">
          <p className="text-sm text-zinc-500">
            {filtered.length === 0
              ? 'No products found'
              : `Showing ${(safePage - 1) * PRODUCTS_PER_PAGE + 1}–${Math.min(safePage * PRODUCTS_PER_PAGE, filtered.length)} of ${filtered.length} product${filtered.length === 1 ? '' : 's'}`}
          </p>
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[...Array(8)].map((_, i) => (
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
            ))}
          </div>
        ) : paginated.length > 0 ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {paginated.map((product) => (
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
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <svg className="h-16 w-16 text-zinc-200 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z" />
            </svg>
            <h3 className="text-lg font-semibold text-zinc-700">No products found</h3>
            <p className="mt-1 text-sm text-zinc-400">Try adjusting your search or category filter.</p>
            <button
              onClick={() => { handleSearch(''); handleCategory('All'); }}
              className="mt-6 rounded-full bg-zinc-950 px-5 py-2 text-sm font-semibold text-white hover:bg-zinc-800 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-12 flex items-center justify-center gap-1.5">
            <button
              id="pagination-prev"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={safePage === 1}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-zinc-200 bg-white text-zinc-500 transition-colors hover:border-zinc-300 hover:text-zinc-900 disabled:opacity-30 disabled:cursor-not-allowed"
              aria-label="Previous page"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
              const isNear = Math.abs(page - safePage) <= 1 || page === 1 || page === totalPages;
              const isDot = !isNear && (page === safePage - 2 || page === safePage + 2);
              if (!isNear && !isDot) return null;
              if (isDot) {
                return <span key={page} className="text-zinc-300 text-sm px-1">…</span>;
              }
              return (
                <button
                  key={page}
                  id={`pagination-page-${page}`}
                  onClick={() => setCurrentPage(page)}
                  className={`flex h-9 w-9 items-center justify-center rounded-xl text-sm font-semibold transition-colors ${
                    page === safePage
                      ? 'bg-zinc-950 text-white'
                      : 'border border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300 hover:text-zinc-900'
                  }`}
                >
                  {page}
                </button>
              );
            })}

            <button
              id="pagination-next"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={safePage === totalPages}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-zinc-200 bg-white text-zinc-500 transition-colors hover:border-zinc-300 hover:text-zinc-900 disabled:opacity-30 disabled:cursor-not-allowed"
              aria-label="Next page"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
