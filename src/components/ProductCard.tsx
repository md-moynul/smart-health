'use client';

import Link from 'next/link';
import type { Product } from '@/lib/products';

type ProductCardProps = Pick<
  Product,
  'id' | 'name' | 'genericName' | 'price' | 'category' | 'image' | 'rating' | 'reviewCount' | 'badge' | 'inStock' | 'requiresPrescription'
>;

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`h-3 w-3 ${
              star <= Math.floor(rating) ? 'fill-amber-400 text-amber-400' : 'fill-zinc-200 text-zinc-200'
            }`}
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
      <span className="text-[10px] text-zinc-400 font-medium">({rating.toFixed(1)})</span>
    </div>
  );
}

function PharmacyIcon({ category }: { category: string }) {
  switch (category) {
    case 'Pain Relief':
      return (
        <svg className="w-14 h-14 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
          <line x1="4.22" y1="4.22" x2="19.78" y2="19.78" strokeLinecap="round" strokeWidth={2} />
          <circle cx="8.5" cy="8.5" r="1.5" fill="currentColor" />
          <circle cx="15.5" cy="15.5" r="1.5" fill="currentColor" />
        </svg>
      );
    case 'Antibiotics':
      return (
        <svg className="w-14 h-14 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path d="M9 3h6l1 3H8L9 3z" strokeLinejoin="round" />
          <path d="M8 6v11a3 3 0 003 3h2a3 3 0 003-3V6" strokeLinejoin="round" />
          <line x1="8" y1="11" x2="16" y2="11" strokeDasharray="2 2" />
        </svg>
      );
    case 'Allergy & Sinus':
      return (
        <svg className="w-14 h-14 text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 12a9 9 0 1118 0 9 9 0 01-18 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 10c0-.55.45-1 1-1h4c.55 0 1 .45 1 1M8 14h8" />
        </svg>
      );
    case 'Diabetes Care':
      return (
        <svg className="w-14 h-14 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 3h6v2l1 1v12a2 2 0 01-2 2H10a2 2 0 01-2-2V6l1-1V3z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4M10 12h4" />
        </svg>
      );
    case 'Heart & Blood Pressure':
      return (
        <svg className="w-14 h-14 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M2 12h3l2-3 2 6 2-4 1 2h3" strokeWidth={1.2} />
        </svg>
      );
    case 'Digestive Health':
      return (
        <svg className="w-14 h-14 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c-1.5 0-3 1-3 2.5 0 2 2 3 2 5s-2 3-2 5c0 1.5 1.5 2.5 3 2.5s3-1 3-2.5c0-2-2-3-2-5s2-3 2-5C15 4 13.5 3 12 3z" />
        </svg>
      );
    case 'Vitamins & Supplements':
      return (
        <svg className="w-14 h-14 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <circle cx="12" cy="12" r="9" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4M12 16h.01" strokeWidth={2.5} />
        </svg>
      );
    case 'Cold & Flu':
      return (
        <svg className="w-14 h-14 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z" />
        </svg>
      );
    case 'Skin & Dermatology':
      return (
        <svg className="w-14 h-14 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 2h8l2 4H6L8 2z" />
          <rect x="5" y="6" width="14" height="14" rx="3" />
          <path strokeLinecap="round" d="M9 12c1 2 5 2 6 0" />
        </svg>
      );
    case 'Eye & Ear Care':
      return (
        <svg className="w-14 h-14 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      );
    case 'Medical Devices':
      return (
        <svg className="w-14 h-14 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <rect x="3" y="4" width="18" height="13" rx="2" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M7 10l2 2 2-3 2 3.5 1-1.5h2" strokeWidth={2} />
          <path strokeLinecap="round" d="M8 20h8M12 17v3" />
        </svg>
      );
    default:
      return (
        <svg className="w-14 h-14 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
        </svg>
      );
  }
}

export default function ProductCard({
  id,
  name,
  genericName,
  price,
  category,
  image,
  rating,
  reviewCount,
  badge,
  inStock,
  requiresPrescription,
}: ProductCardProps) {
  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-zinc-150 bg-white transition-all duration-300 hover:border-zinc-200 hover:shadow-xl hover:shadow-zinc-100/80 hover:-translate-y-0.5 w-full max-w-sm">
      {/* Image / Icon Area */}
      <div className="relative flex aspect-4/3 w-full items-center justify-center overflow-hidden bg-zinc-50 border-b border-zinc-100">
        {/* Rx badge */}
        {requiresPrescription && (
          <span className="absolute top-3 left-3 z-10 rounded-full bg-blue-600 px-2.5 py-1 text-[10px] font-bold tracking-wider text-white uppercase shadow-sm">
            Rx
          </span>
        )}
        {/* Other badges */}
        {badge && badge !== 'Rx Only' && (
          <span className="absolute top-3 right-3 z-10 rounded-full bg-zinc-900 px-2.5 py-1 text-[10px] font-semibold tracking-wider text-white uppercase shadow-sm">
            {badge}
          </span>
        )}
        {!inStock && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/70 backdrop-blur-xs">
            <span className="rounded-full bg-zinc-200 px-3 py-1 text-[10px] font-semibold tracking-wider text-zinc-650 uppercase">
              Out of Stock
            </span>
          </div>
        )}

        {/* Conditional Renderer for Custom Asset Images vs Fallback vector graphics */}
        <div className="w-full h-full flex items-center justify-center transform transition-transform duration-500 ease-out group-hover:scale-105">
          {image && image.trim() !== '' ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img 
              src={image} 
              alt={name} 
              className="w-full h-full object-contain p-4"
              loading="lazy"
              onError={(e) => {
                // Safe fallback configuration if the CDN asset path fails to load
                (e.target as HTMLImageElement).style.display = 'none';
                const container = (e.target as HTMLImageElement).parentElement;
                if (container) {
                  container.setAttribute('data-failed', 'true');
                }
              }}
            />
          ) : null}

          {/* Render fallback layout vector when path is empty or validation flags an image loading crash */}
          {(!image || image.trim() === '') && (
            <PharmacyIcon category={category} />
          )}
        </div>
      </div>

      {/* Info Content Area */}
      <div className="flex flex-1 flex-col p-4">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-emerald-600">
          {category}
        </span>
        <h3 className="mt-1 text-sm font-semibold text-zinc-900 line-clamp-2 leading-snug min-h-10">
          {name}
        </h3>
        {genericName && (
          <p className="mt-0.5 text-[11px] italic text-zinc-400 line-clamp-1">{genericName}</p>
        )}

        <div className="mt-2.5 flex items-center gap-2">
          <StarRating rating={rating} />
          <span className="text-[10px] text-zinc-400">({reviewCount.toLocaleString()} reviews)</span>
        </div>

        <div className="mt-auto pt-4 flex items-center justify-between">
          <span className="text-base font-bold text-zinc-950">${price.toFixed(2)}</span>
          <Link
            href={`/products/${id}`}
            id={`view-product-${id}`}
            className="rounded-full bg-zinc-950 px-3.5 py-1.5 text-[11px] font-semibold text-white transition-colors hover:bg-emerald-600 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/50"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}