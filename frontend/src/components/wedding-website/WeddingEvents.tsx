type Event = {
  id: string;
  title: string;
  description: string | null;
  date: string | null;
  time: string | null;
  venue: string | null;
};

type Props = {
  events: Event[];
};

export default function WeddingEvents({
  events,
}: Props) {
  return (
    <section className="relative overflow-hidden bg-white py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center">
          <p className="text-sm uppercase tracking-[0.45em] text-rose-500">
            Celebrations
          </p>

          <h2 className="mt-4 text-5xl font-bold">
            Our Wedding Events
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-500">
            We would be delighted to have you join us
            in every celebration.
          </p>

          <div className="mx-auto mt-8 h-[2px] w-28 bg-gradient-to-r from-transparent via-rose-400 to-transparent" />
        </div>

        {events.length > 0 ? (
          <div className="relative mt-24">
            <div className="absolute left-1/2 top-0 hidden h-full w-[2px] -translate-x-1/2 bg-rose-200 lg:block" />

            <div className="space-y-16">
              {events.map((event, index) => (
                <div
                  key={event.id}
                  className={`flex items-center gap-10 ${
                    index % 2 === 0
                      ? "lg:flex-row"
                      : "lg:flex-row-reverse"
                  }`}
                >
                  <div className="hidden flex-1 lg:block" />

                  <div className="z-10 hidden h-6 w-6 rounded-full border-4 border-white bg-rose-500 shadow-xl lg:block" />

                  <div className="flex-1">
                    <div className="rounded-[36px] border border-rose-100 bg-rose-50 p-10 shadow-xl transition duration-300 hover:-translate-y-2">
                      <div className="flex items-center justify-between">
                        <h3 className="text-3xl font-bold">
                          {event.title}
                        </h3>

                        <span className="rounded-full bg-white px-4 py-2 text-sm font-medium text-rose-500">
                          Event
                        </span>
                      </div>

                      {event.description && (
                        <p className="mt-5 text-gray-600">
                          {event.description}
                        </p>
                      )}

                      <div className="mt-8 space-y-3 text-gray-700">
                        <p>
                          📅{" "}
                          {event.date
                            ? new Date(
                                event.date,
                              ).toLocaleDateString(
                                "en-IN",
                                {
                                  weekday: "long",
                                  day: "numeric",
                                  month: "long",
                                },
                              )
                            : "To be announced"}
                        </p>

                        <p>
                          🕒{" "}
                          {event.time ??
                            "Time will be updated"}
                        </p>

                        <p>
                          📍{" "}
                          {event.venue ??
                            "Venue will be updated"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="mt-20 rounded-[40px] border border-dashed border-rose-200 bg-rose-50 p-20 text-center shadow-xl">
            <div className="text-8xl">🎉</div>

            <h3 className="mt-8 text-4xl font-bold">
              Celebration Schedule Coming Soon
            </h3>

            <p className="mx-auto mt-5 max-w-xl text-lg text-gray-500">
              The details of our wedding ceremonies
              will be shared very soon.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}