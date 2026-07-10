"use client";

export default function InsightsCard() {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
      <h2 className="text-2xl font-bold text-gray-800">
        Insights
      </h2>

      <div className="mt-8 space-y-4">
        <div className="rounded-2xl bg-[#fff8ef] p-4 text-gray-700">
          📈 Profile views increased by 24%.
        </div>

        <div className="rounded-2xl bg-[#fff8ef] p-4 text-gray-700">
          ⭐ Rating remains above 4.8.
        </div>

        <div className="rounded-2xl bg-[#fff8ef] p-4 text-gray-700">
          💰 Photography generates highest revenue.
        </div>
      </div>
    </section>
  );
}