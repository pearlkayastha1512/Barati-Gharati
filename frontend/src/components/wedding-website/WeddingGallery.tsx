type Props = {
  galleryImages: string[];
};

export default function WeddingGallery({
  galleryImages,
}: Props) {
  const rotations = [
    "-rotate-2",
    "rotate-2",
    "rotate-1",
    "-rotate-1",
    "rotate-3",
    "-rotate-3",
  ];

  return (
    <section className="relative overflow-hidden bg-[#fdfaf7] py-36">
      {/* Background blobs */}

      <div className="absolute left-0 top-0 h-[30rem] w-[30rem] rounded-full bg-rose-100/40 blur-3xl" />

      <div className="absolute bottom-0 right-0 h-[32rem] w-[32rem] rounded-full bg-amber-100/40 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-6">
        {/* Header */}

        <div className="text-center">
          <p className="text-xs uppercase tracking-[0.65em] text-rose-500">
            Our Memories
          </p>

          <h2 className="mt-5 font-serif text-5xl text-slate-900 md:text-7xl">
            Wedding Gallery
          </h2>

          <p className="mx-auto mt-6 max-w-3xl text-lg leading-9 text-slate-500">
            A collection of stolen glances, joyful laughter, and
            unforgettable moments that tell the story of our journey.
          </p>

          <div className="mx-auto mt-8 h-px w-40 bg-gradient-to-r from-transparent via-rose-400 to-transparent" />
        </div>

        {galleryImages.length > 0 ? (
          <>
            <div className="mt-10 text-center">
              <span className="rounded-full bg-white px-6 py-2 text-sm font-medium text-slate-600 shadow-lg">
                {galleryImages.length} Memories Captured ✨
              </span>
            </div>

            <div className="mt-24 grid grid-cols-1 gap-y-20 md:grid-cols-2 xl:grid-cols-3">
              {galleryImages.map(
                (image, index) => (
                  <div
                    key={`${image}-${index}`}
                    className={`group mx-auto w-[90%] ${
                      rotations[
                        index %
                          rotations.length
                      ]
                    } transition-all duration-500 hover:z-20 hover:rotate-0 hover:scale-105`}
                  >
                    <div className="overflow-hidden rounded-[2rem] bg-white p-4 shadow-[0_20px_80px_rgba(0,0,0,0.12)]">
                      <div className="relative overflow-hidden rounded-[1.5rem]">
                        <img
                          src={image}
                          alt={`Wedding memory ${
                            index + 1
                          }`}
                          className="h-[420px] w-full object-cover transition duration-700 group-hover:scale-110"
                        />

                        {/* Overlay */}

                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-0 transition duration-500 group-hover:opacity-100" />

                        <div className="absolute bottom-6 left-6 translate-y-8 opacity-0 transition duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                          <p className="text-xs uppercase tracking-[0.3em] text-white/70">
                            Wedding Memory
                          </p>

                          <h3 className="mt-2 font-serif text-3xl text-white">
                            #{index + 1}
                          </h3>
                        </div>
                      </div>

                      <div className="mt-5 px-2 pb-2 text-center">
                        <p className="text-[10px] uppercase tracking-[0.4em] text-rose-400">
                          Cherished Moment
                        </p>

                        <h3 className="mt-2 font-serif text-2xl text-slate-900">
                          Memory #{index + 1}
                        </h3>

                        <p className="mt-2 text-sm text-slate-500">
                          Captured with love and
                          happiness ✨
                        </p>
                      </div>
                    </div>
                  </div>
                ),
              )}
            </div>
          </>
        ) : (
          <div className="mt-24 text-center">
            <div className="mx-auto flex h-36 w-36 items-center justify-center rounded-full border border-rose-100 bg-white shadow-[0_20px_60px_rgba(0,0,0,0.08)]">
              <span className="text-6xl">
                📸
              </span>
            </div>

            <h3 className="mt-10 font-serif text-5xl text-slate-900">
              Memories Await
            </h3>

            <p className="mx-auto mt-6 max-w-2xl text-lg leading-9 text-slate-500">
              Our story is still being written.
              Soon, this gallery will be filled
              with moments of joy, celebration,
              and everlasting love.
            </p>

            <div className="mx-auto mt-10 h-px w-28 bg-gradient-to-r from-transparent via-rose-400 to-transparent" />
          </div>
        )}
      </div>
    </section>
  );
}