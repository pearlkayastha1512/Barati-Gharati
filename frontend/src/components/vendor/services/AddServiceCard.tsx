"use client";

import { Plus } from "lucide-react";

interface AddServiceCardProps {
  onCreate: () => void;
}

export default function AddServiceCard({
  onCreate,
}: AddServiceCardProps) {
  return (
    <section className="rounded-3xl border-2 border-dashed border-[#ffc43d] bg-[#fff8ef] p-12 text-center">

      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#ffe1ec]">

        <Plus
          size={34}
          className="text-[#e4005a]"
        />

      </div>

      <h2 className="mt-6 text-3xl font-bold text-slate-900">
        Add New Service
      </h2>

      <p className="mx-auto mt-4 max-w-xl text-slate-500">
        Create a new wedding service with pricing,
        description, gallery and availability.
      </p>

      <button
        onClick={onCreate}
        className="mt-8 rounded-2xl bg-[#e4005a] px-8 py-4 font-semibold text-white transition hover:bg-[#c8004e]"
      >
        Create Service
      </button>

    </section>
  );
}