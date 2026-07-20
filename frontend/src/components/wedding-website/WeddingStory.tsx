type Props = {
  brideName: string;
  groomName: string;
  story: string | null;
  image: string | null;
};

export default function WeddingStory({
  brideName,
  groomName,
  story,
  image,
}: Props) {
  return (
    <section className="relative overflow-hidden py-32">
      {/* Background blobs */}

      <div className="absolute -left-24 top-16 h-72 w-72 rounded-full bg-rose-100/60 blur-3xl" />

      <div className="absolute -right-24 bottom-10 h-80 w-80 rounded-full bg-pink-100/60 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-6">
        {/* Heading */}

        <div className="text-center">
          <p className="text-sm uppercase tracking-[0.5em] text-rose-500">
            Our Story
          </p>

          <h2 className="mt-5 text-5xl font-bold text-slate-900 md:text-6xl">
            A Journey Of Forever
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-500">
            Every love story is unique. Ours is filled with
            laughter, memories, and countless beautiful moments.
          </p>

          <div className="mx-auto mt-8 h-[2px] w-32 bg-gradient-to-r from-transparent via-rose-400 to-transparent" />
        </div>

        {/* Main card */}

        <div className="mt-20 grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr]">
          {/* Image */}

          <div className="group relative">
            <div className="absolute -inset-4 rounded-[42px] bg-gradient-to-r from-rose-200/60 to-pink-200/60 blur-2xl" />

            <div className="relative overflow-hidden rounded-[42px] shadow-2xl">
              <img
                src={
                  image ??
                  "https://images.unsplash.com/photo-1529636798458-92182e662485?q=80&w=1600"
                }
                alt={`${groomName} and ${brideName}`}
                className="h-[650px] w-full object-cover transition duration-700 group-hover:scale-105"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />

              <div className="absolute bottom-10 left-10">
                <p className="text-sm uppercase tracking-[0.4em] text-white/80">
                  Together Forever
                </p>

                <h3 className="mt-3 text-4xl font-bold text-white">
                  {groomName} & {brideName}
                </h3>
              </div>
            </div>
          </div>

          {/* Story */}

          <div className="relative rounded-[42px] border border-rose-100 bg-white p-10 shadow-2xl md:p-14">
            <div className="absolute right-8 top-8 text-8xl text-rose-100">
              ❝
            </div>

            <p className="text-sm uppercase tracking-[0.4em] text-rose-500">
              The Beginning
            </p>

            <h3 className="mt-5 text-4xl font-bold leading-tight text-slate-900">
              When Two Hearts Became One
            </h3>

            <p className="mt-8 text-lg leading-10 text-slate-600">
              {story ??
                `What started as a simple meeting soon turned into a beautiful journey of friendship, laughter, and endless memories. With the blessings of our loved ones, we are excited to begin this new chapter together and celebrate our special day with all of you.`}
            </p>

            <div className="mt-12 flex items-center gap-4">
              <div className="h-px flex-1 bg-rose-200" />

              <span className="text-4xl text-rose-500">
                ❤️
              </span>

              <div className="h-px flex-1 bg-rose-200" />
            </div>

            <div className="mt-10 grid grid-cols-2 gap-6">
              <div className="rounded-3xl bg-rose-50 p-6 text-center">
                <p className="text-sm uppercase tracking-[0.2em] text-rose-500">
                  Bride
                </p>

                <h4 className="mt-2 text-2xl font-bold">
                  {brideName}
                </h4>
              </div>

              <div className="rounded-3xl bg-rose-50 p-6 text-center">
                <p className="text-sm uppercase tracking-[0.2em] text-rose-500">
                  Groom
                </p>

                <h4 className="mt-2 text-2xl font-bold">
                  {groomName}
                </h4>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}