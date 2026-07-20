type Props = {
  brideName: string;
  groomName: string;
};

export default function WeddingFooter({
  brideName,
  groomName,
}: Props) {
  return (
    <footer className="relative overflow-hidden bg-[#2b0d12] px-6 py-32 text-white">
      {/* Background glow */}
      <div className="absolute left-[-120px] top-[-120px] h-72 w-72 rounded-full bg-rose-500/10 blur-3xl" />

      <div className="absolute bottom-[-150px] right-[-150px] h-96 w-96 rounded-full bg-pink-500/10 blur-3xl" />

      {/* Decorative lines */}
      <div className="absolute left-1/2 top-0 h-24 w-px -translate-x-1/2 bg-gradient-to-b from-rose-300/60 to-transparent" />

      <div className="relative mx-auto max-w-4xl text-center">
        {/* Top text */}

        <p className="text-xs uppercase tracking-[0.7em] text-rose-300">
          Thank You
        </p>

        {/* Couple names */}

        <h2 className="mt-8 font-serif text-5xl leading-tight md:text-7xl">
          {groomName}

          <span className="mx-4 text-rose-300">&</span>

          {brideName}
        </h2>

        {/* Divider */}

        <div className="mx-auto mt-8 flex items-center justify-center gap-4">
          <div className="h-px w-16 bg-rose-300/40" />

          <span className="text-2xl text-rose-300">
            ❦
          </span>

          <div className="h-px w-16 bg-rose-300/40" />
        </div>

        {/* Message */}

        <p className="mx-auto mt-10 max-w-2xl text-lg leading-9 text-rose-100/90">
          Thank you for being part of our
          special day. Your love, blessings,
          and presence mean the world to us.
          We look forward to celebrating,
          laughing, and creating beautiful
          memories together.
        </p>

        {/* Bottom section */}

        <div className="mt-16 border-t border-white/10 pt-8">
          <p className="text-sm tracking-[0.3em] text-rose-200/80">
            WITH LOVE • FOREVER • TOGETHER
          </p>

          <p className="mt-5 text-sm text-rose-100/60">
            Crafted with love for our wedding
            celebration ✨
          </p>
        </div>
      </div>
    </footer>
  );
}