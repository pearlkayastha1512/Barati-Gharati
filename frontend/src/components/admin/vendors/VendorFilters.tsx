"use client";

interface Props {
  search: string;
  setSearch: (value: string) => void;

  status: string;
  setStatus: (value: string) => void;

  category: string;
  setCategory: (value: string) => void;
}

export default function VendorFilters({
  search,
  setSearch,
  status,
  setStatus,
  category,
  setCategory,
}: Props) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Search */}

        <input
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          placeholder="Search by business, owner or city..."
          className="rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-blue-600 text-gray-600"
        />

        {/* Status */}

        <select
          value={status}
          onChange={(e) =>
            setStatus(e.target.value)
          }
          className="rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-blue-600 text-gray-600"
        >
          <option value="all">
            All Status
          </option>

          <option value="pending">
            Pending
          </option>

          <option value="approved">
            Approved
          </option>

          <option value="rejected">
            Rejected
          </option>
        </select>

        {/* Category */}

        <input
          value={category}
          onChange={(e) =>
            setCategory(e.target.value)
          }
          placeholder="Category..."
          className="rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-blue-600 text-gray-600"
        />
      </div>
    </section>
  );
}