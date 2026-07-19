interface FeatureItem {
  title: string;
  description: string;
  icon: React.ReactNode;
}

export default function WhyChooseUs() {
  const features: FeatureItem[] = [
    {
      title: 'Easy Rx Transfer',
      description: 'Transfer your prescriptions from Walgreens, CVS, or Boots in minutes. We handle the paperwork for you.',
      icon: (
        <svg className="h-6 w-6 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
        </svg>
      ),
    },
    {
      title: '24/7 Pharmacist Access',
      description: 'Consult with licensed, certified pharmacists anytime via secure chat or video call for guidance.',
      icon: (
        <svg className="h-6 w-6 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      ),
    },
    {
      title: 'Same-Day Local Delivery',
      description: 'Get your critical medications delivered directly to your doorstep. Free 1-hour store curbside pickup is also available.',
      icon: (
        <svg className="h-6 w-6 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
        </svg>
      ),
    },
    {
      title: 'Insurance Integration',
      description: 'We process and accept most major health insurance plans, copays, HSA/FSA cards to ensure affordability.',
      icon: (
        <svg className="h-6 w-6 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
        </svg>
      ),
    },
  ];

  return (
    <section className="bg-zinc-50 py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-950 sm:text-4xl">
            Why Choose SmartHealth
          </h2>
          <p className="mt-4 text-base text-zinc-600">
            We merge cutting-edge biological science with premium product design to help you live a better, healthier life.
          </p>
        </div>

        <div className="mx-auto mt-16 max-w-5xl sm:mt-20">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:gap-12">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="flex flex-col items-start gap-4 rounded-2xl border border-zinc-200 bg-white p-6 hover:shadow-md hover:shadow-zinc-100 transition-shadow sm:flex-row sm:p-8"
              >
                <div className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-50">
                  {feature.icon}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-zinc-900">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-zinc-500">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
