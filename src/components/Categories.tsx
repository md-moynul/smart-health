import Link from 'next/link';

interface CategoryItem {
  title: string;
  description: string;
  href: string;
  icon: React.ReactNode;
}

export default function Categories() {
  const categories: CategoryItem[] = [
    {
      title: 'Prescriptions',
      description: 'Refill, transfer, and manage your Rx medications online.',
      href: '/dashboard',
      icon: (
        <svg className="h-6 w-6 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
    },
    {
      title: 'OTC Medicines',
      description: 'Allergy relief, pain management, and digestive health.',
      href: '/products?category=otc',
      icon: (
        <svg className="h-6 w-6 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
        </svg>
      ),
    },
    {
      title: 'Vitamins & Supplements',
      description: 'Daily multivitamins, minerals, and target support.',
      href: '/products?category=supplements',
      icon: (
        <svg className="h-6 w-6 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      ),
    },
    {
      title: 'Diagnostics & Monitors',
      description: 'Blood pressure cuffs, thermometers, and test kits.',
      href: '/products?category=diagnostics',
      icon: (
        <svg className="h-6 w-6 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
    },
    {
      title: 'Personal Care',
      description: 'Dermatologist-recommended skin, hair, and dental care.',
      href: '/products?category=personal-care',
      icon: (
        <svg className="h-6 w-6 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      title: 'Baby & Child Health',
      description: 'Pediatric vitamins, gentle skin formulas, and remedies.',
      href: '/products?category=baby-child',
      icon: (
        <svg className="h-6 w-6 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m12.728 12.728l-.707.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
        </svg>
      ),
    },
  ];

  return (
    <section className="bg-zinc-50 py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center sm:text-left">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-950 sm:text-4xl">
            Explore Categories
          </h2>
          <p className="mt-4 text-base text-zinc-600 max-w-xl">
            Target specific dimensions of your wellness with our highly specialized, quality-assured product categories.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <Link
              key={category.title}
              href={category.href}
              className="group relative flex flex-col justify-between rounded-2xl border border-zinc-200 bg-white p-6 transition-all hover:border-zinc-300 hover:shadow-md hover:shadow-zinc-100"
            >
              <div>
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 group-hover:scale-110 transition-transform duration-300">
                  {category.icon}
                </div>
                <h3 className="mt-6 text-lg font-semibold text-zinc-900">
                  {category.title}
                </h3>
                <p className="mt-2 text-sm text-zinc-500">
                  {category.description}
                </p>
              </div>
              <div className="mt-6 flex items-center text-xs font-semibold text-emerald-600">
                Browse Products
                <svg className="ml-1 h-3 w-3 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
