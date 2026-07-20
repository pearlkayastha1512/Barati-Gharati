type Props = {
  weddingDate: string | null;
  venueName: string | null;
  venueAddress: string | null;
};

export default function WeddingDetails({
  weddingDate,
  venueName,
  venueAddress,
}: Props) {
  const details = [
    {
      title: "The Day",
      subtitle: "Wedding Ceremony",
      icon: "✦",
      value: weddingDate
        ? new Date(weddingDate).toLocaleDateString("en-IN", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
          })
        : "To be announced",
    },
    {
      title: "The Place",
      subtitle: "Venue",
      icon: "❦",
      value: venueName || "Venue will be announced soon",
    },
    {
      title: "Location",
      subtitle: "Address",
      icon: "✧",
      value: venueAddress || "Address coming soon",
    },
  ];

  return (
    <section className="relative overflow-hidden bg-[#fdf9f6] py-32">
      {/* Background decorations */}
      <div className="absolute left-0 top-0 h-96 w-96 rounded-full bg-rose-100/40 blur-3xl" />

      <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-amber-100/40 blur-3xl" />

      <div className="relative mx-auto max-w-6xl px-6">
        {/* Heading */}
        <div className="text-center">
          <p className="text-xs uppercase tracking-[0.6em] text-rose-500">
            Wedding Details
          </p>

          <h2 className="mt-5 font-serif text-5xl text-neutral-900 md:text-7xl">
            Save The Date
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-neutral-600">
            We invite you to celebrate the beginning of our forever.
            Mark your calendars and join us on this beautiful occasion.
          </p>
        </div>

        {/* Timeline */}
        <div className="relative mt-24">
          {/* Center line */}
          <div className="absolute left-1/2 hidden h-full w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-rose-300 to-transparent md:block" />

          <div className="space-y-24">
            {details.map((item, index) => (
              <div
                key={item.title}
                className={`grid items-center gap-10 md:grid-cols-2 ${
                  index % 2 === 1 ? "md:[&>*:first-child]:order-2" : ""
                }`}
              >
                {/* Content */}
                <div
                  className={`${
                    index % 2 === 0 ? "md:text-right" : "md:text-left"
                  }`}
                >
                  <p className="text-sm uppercase tracking-[0.35em] text-rose-400">
                    {item.subtitle}
                  </p>

                  <h3 className="mt-3 font-serif text-4xl text-neutral-900">
                    {item.title}
                  </h3>

                  <p className="mt-5 text-lg leading-8 text-neutral-600">
                    {item.value}
                  </p>
                </div>

                {/* Center ornament */}
                <div className="relative flex justify-center">
                  <div className="flex h-24 w-24 items-center justify-center rounded-full border border-rose-200 bg-white shadow-[0_10px_50px_rgba(0,0,0,0.08)]">
                    <span className="text-3xl text-rose-500">
                      {item.icon}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer quote */}
        <div className="mt-28 text-center">
          <div className="mx-auto h-px w-32 bg-gradient-to-r from-transparent via-rose-300 to-transparent" />

          <p className="mx-auto mt-8 max-w-2xl font-serif text-2xl italic text-neutral-700">
            “Together with our families, we warmly invite you to
            share in our joy and celebrate our special day.”
          </p>
        </div>
      </div>
    </section>
  );
}