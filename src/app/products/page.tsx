'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import ProductCard from '@/components/ProductCard';
import { CATEGORIES, Product } from '@/lib/products';

const PRODUCTS_PER_PAGE = 8;

export default function ProductsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Read state from URL search params
  const search = searchParams.get('search') || '';
  const selectedCategory = searchParams.get('category') || 'All';
  const sortBy = searchParams.get('sort') || 'default';
  const currentPage = Math.max(1, parseInt(searchParams.get('page') || '1', 10) || 1);

  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  // Helper: update URL search params
  const updateParams = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());

      Object.entries(updates).forEach(([key, value]) => {
        if (value === null || value === '' || value === 'All' || value === 'default' || (key === 'page' && value === '1')) {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      });

      const qs = params.toString();
      router.push(`/products${qs ? `?${qs}` : ''}`, { scroll: false });
    },
    [router, searchParams]
  );

  // Fetch products when search params change
  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);
        const queryParams = new URLSearchParams();
        if (search) queryParams.set('search', search);
        if (selectedCategory !== 'All') queryParams.set('category', selectedCategory);
        if (sortBy !== 'default') queryParams.set('sort', sortBy);
        queryParams.set('page', String(currentPage));
        queryParams.set('limit', String(PRODUCTS_PER_PAGE));

        const res = await fetch(`/api/products?${queryParams.toString()}`);
        const data = await res.json();

        if (data.products && Array.isArray(data.products)) {
          setProducts(data.products);
          setTotal(data.total || 0);
          setTotalPages(data.totalPages || 1);
        }
      } catch (err) {
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, [search, selectedCategory, sortBy, currentPage]);

  // Handlers that update URL params
  const handleSearch = (val: string) => {
    updateParams({ search: val || null, page: '1' });
  };

  const handleCategory = (cat: string) => {
    updateParams({ category: cat === 'All' ? null : cat, page: '1' });
  };

  const handleSort = (val: string) => {
    updateParams({ sort: val === 'default' ? null : val, page: '1' });
  };

  const handlePage = (page: number) => {
    updateParams({ page: page === 1 ? null : String(page) });
  };

  // Debounced search input
  const [searchInput, setSearchInput] = useState(search);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSearchInput(search);
  }, [search]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput !== search) {
        handleSearch(searchInput);
      }
    }, 400);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchInput]);

  const startItem = total === 0 ? 0 : (currentPage - 1) * PRODUCTS_PER_PAGE + 1;
  const endItem = Math.min(currentPage * PRODUCTS_PER_PAGE, total);

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
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search products..."
              className="block w-full rounded-xl border border-zinc-200 bg-white py-2.5 pl-10 pr-4 text-sm text-zinc-900 placeholder-zinc-400 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
            {searchInput && (
              <button
                onClick={() => { setSearchInput(''); handleSearch(''); }}
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
              onChange={(e) => handleSort(e.target.value)}
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
            {total === 0
              ? 'No products found'
              : `Showing ${startItem}–${endItem} of ${total} product${total === 1 ? '' : 's'}`}
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
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => (
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
              onClick={() => { setSearchInput(''); updateParams({ search: null, category: null, sort: null, page: null }); }}
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
              onClick={() => handlePage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-zinc-200 bg-white text-zinc-500 transition-colors hover:border-zinc-300 hover:text-zinc-900 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
              aria-label="Previous page"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
              const isNear = Math.abs(page - currentPage) <= 1 || page === 1 || page === totalPages;
              const isDot = !isNear && (page === currentPage - 2 || page === currentPage + 2);
              if (!isNear && !isDot) return null;
              if (isDot) {
                return <span key={page} className="text-zinc-300 text-sm px-1">…</span>;
              }
              return (
                <button
                  key={page}
                  id={`pagination-page-${page}`}
                  onClick={() => handlePage(page)}
                  className={`flex h-9 w-9 items-center justify-center rounded-xl text-sm font-semibold transition-colors cursor-pointer ${
                    page === currentPage
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
              onClick={() => handlePage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-zinc-200 bg-white text-zinc-500 transition-colors hover:border-zinc-300 hover:text-zinc-900 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
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
