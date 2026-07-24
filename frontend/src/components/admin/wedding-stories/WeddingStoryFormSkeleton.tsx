export default function WeddingStoryFormSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      {/* Header */}
      <div className="space-y-3">
        <div className="h-5 w-40 rounded-full bg-pink-100" />
        <div className="h-10 w-72 rounded-xl bg-pink-100" />
        <div className="h-4 w-96 rounded-full bg-pink-50" />
      </div>

      {/* Basic Information */}
      <div className="rounded-3xl border border-pink-100 bg-white p-8 shadow-sm">
        <div className="mb-8 h-8 w-56 rounded-xl bg-pink-100" />

        <div className="grid gap-6 md:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-3">
              <div className="h-4 w-28 rounded bg-pink-100" />
              <div className="h-12 rounded-xl bg-pink-50" />
            </div>
          ))}
        </div>
      </div>

      {/* Cover Image */}
      <div className="rounded-3xl border border-pink-100 bg-white p-8 shadow-sm">
        <div className="mb-6 h-8 w-44 rounded-xl bg-pink-100" />

        <div className="h-72 rounded-3xl border-2 border-dashed border-pink-100 bg-pink-50" />
      </div>

      {/* Wedding Details */}
      <div className="rounded-3xl border border-pink-100 bg-white p-8 shadow-sm">
        <div className="mb-8 h-8 w-48 rounded-xl bg-pink-100" />

        <div className="grid gap-6 md:grid-cols-2">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="space-y-3">
              <div className="h-4 w-24 rounded bg-pink-100" />
              <div className="h-12 rounded-xl bg-pink-50" />
            </div>
          ))}
        </div>
      </div>

      {/* Story */}
      <div className="rounded-3xl border border-pink-100 bg-white p-8 shadow-sm">
        <div className="mb-6 h-8 w-40 rounded-xl bg-pink-100" />

        <div className="h-48 rounded-2xl bg-pink-50" />
      </div>

      {/* Gallery */}
      <div className="rounded-3xl border border-pink-100 bg-white p-8 shadow-sm">
        <div className="mb-6 h-8 w-44 rounded-xl bg-pink-100" />

        <div className="grid gap-6 md:grid-cols-2">
          {Array.from({ length: 2 }).map((_, i) => (
            <div
              key={i}
              className="h-60 rounded-2xl bg-pink-50"
            />
          ))}
        </div>
      </div>

      {/* Timeline */}
      <div className="rounded-3xl border border-pink-100 bg-white p-8 shadow-sm">
        <div className="mb-6 h-8 w-52 rounded-xl bg-pink-100" />

        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="mb-5 h-28 rounded-2xl bg-pink-50"
          />
        ))}
      </div>

      {/* Button */}
      <div className="h-14 w-48 rounded-2xl bg-gradient-to-r from-pink-100 to-amber-100" />
    </div>
  );
}