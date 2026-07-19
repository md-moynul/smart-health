interface Testimonial {
  id: string;
  name: string;
  role: string;
  content: string;
  rating: number;
  avatar: string;
}

export default function Testimonials() {
  const testimonials: Testimonial[] = [
    {
      id: '1',
      name: 'Sarah Jenkins',
      role: 'Chronic Care Patient',
      content: 'Transferring my daily heart prescriptions from my old pharmacy was incredibly simple. The monthly auto-refill now arrives right on schedule without any phone calls.',
      rating: 5,
      avatar: 'SJ',
    },
    {
      id: '2',
      name: 'Marcus Chen',
      role: 'Father of Two',
      content: 'Outstanding same-day delivery service. I ordered child allergy tablets and a forehead thermometer when my son fell ill, and the order arrived in under 2 hours.',
      rating: 5,
      avatar: 'MC',
    },
    {
      id: '3',
      name: 'Elena Rostova',
      role: 'Asthma Patient',
      content: 'Having access to a live certified pharmacist at 10 PM to ask questions about my inhaler dosage conflicts gave me complete peace of mind. Highly recommended.',
      rating: 5,
      avatar: 'ER',
    },
  ];

  return (
    <section className="bg-white py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-950 sm:text-4xl">
            What Our Customers Say
          </h2>
          <p className="mt-4 text-base text-zinc-600">
            Real stories from individuals optimizing their daily vitality and well-being.
          </p>
        </div>

        <div className="mx-auto mt-16 grid max-w-5xl grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="flex flex-col justify-between rounded-2xl border border-zinc-150 bg-white p-6 shadow-sm hover:shadow-md hover:shadow-zinc-100 transition-shadow"
            >
              <div>
                {/* Stars */}
                <div className="flex items-center text-amber-400">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <svg
                      key={i}
                      className="h-4 w-4 fill-current"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="mt-4 text-sm leading-6 text-zinc-600 italic">
                  &ldquo;{testimonial.content}&rdquo;
                </p>
              </div>

              <div className="mt-8 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-50 text-sm font-semibold text-emerald-700">
                  {testimonial.avatar}
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-zinc-900">
                    {testimonial.name}
                  </h4>
                  <p className="text-xs text-zinc-500">
                    {testimonial.role}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
