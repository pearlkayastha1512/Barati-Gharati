type Props = {
  brideName: string;
  groomName: string;
  weddingDate?: string | null;
  image?: string | null;
};

export default function WeddingHero({
  brideName,
  groomName,
  weddingDate,
  image,
}: Props) {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden">
      <img
        src={
          image ||
          "https://images.unsplash.com/photo-1519741497674-611481863552"
        }
        alt="Wedding"
        className="absolute inset-0 h-full w-full object-cover"
      />

      <div className="absolute inset-0 bg-black/50" />

      <div className="relative z-10 px-6 text-center text-white">
        <p className="mb-6 text-sm uppercase tracking-[0.5em]">
          Together Forever
        </p>

        <h1 className="text-6xl font-bold md:text-8xl">
          {groomName}
        </h1>

        <p className="my-4 text-3xl opacity-80">
          &
        </p>

        <h1 className="text-6xl font-bold md:text-8xl">
          {brideName}
        </h1>

        {weddingDate && (
          <p className="mt-10 text-xl">
            {new Date(
              weddingDate
            ).toLocaleDateString()}
          </p>
        )}
      </div>
    </section>
  );
}