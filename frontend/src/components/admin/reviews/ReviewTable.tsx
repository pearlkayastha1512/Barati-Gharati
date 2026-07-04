"use client";

import { Eye, Star } from "lucide-react";

import { Review } from "@/types/review";

interface Props {
  reviews: Review[];

  onView: (review: Review) => void;
}

export default function ReviewTable({
  reviews,
  onView,
}: Props) {
  if (reviews.length === 0) {
    return (
      <section className="rounded-3xl border border-slate-200 bg-white p-20 text-center shadow-sm">
        <h2 className="text-2xl font-bold text-slate-700">
          No Reviews Found
        </h2>

        <p className="mt-3 text-slate-500">
          Try changing the filters.
        </p>
      </section>
    );
  }

  return (
    <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-slate-50">
            <tr className="text-left">
              <th className="px-6 py-4 font-semibold text-slate-700">
                Customer
              </th>

              <th className="px-6 py-4 font-semibold text-slate-700">
                Vendor
              </th>

              <th className="px-6 py-4 font-semibold text-slate-700">
                Rating
              </th>

              <th className="px-6 py-4 font-semibold text-slate-700">
                Review
              </th>

              <th className="px-6 py-4 font-semibold text-slate-700">
                Date
              </th>

              <th className="px-6 py-4 font-semibold text-slate-700">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="text-slate-600">
            {reviews.map((review) => (
              <tr
                key={review.id}
                className="border-t border-slate-100 hover:bg-slate-50"
              >
                <td className="px-6 py-5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-700">
                      {review.customerName
                        .charAt(0)
                        .toUpperCase()}
                    </div>

                    <div>
                      <h3 className="font-semibold text-slate-900">
                        {review.customerName}
                      </h3>
                    </div>
                  </div>
                </td>

                <td className="px-6 py-5">
                  {review.vendorName}
                </td>

                <td className="px-6 py-5">
                  <div className="flex items-center gap-1">
                    {Array.from({
                      length: review.rating,
                    }).map((_, index) => (
                      <Star
                        key={index}
                        size={16}
                        className="fill-yellow-400 text-yellow-400"
                      />
                    ))}

                    <span className="ml-2 text-sm">
                      ({review.rating})
                    </span>
                  </div>
                </td>

                <td className="max-w-xs px-6 py-5">
                  <p className="truncate">
                    {review.comment}
                  </p>
                </td>

                <td className="px-6 py-5">
                  {new Date(
                    review.createdAt
                  ).toLocaleDateString()}
                </td>

                <td className="px-6 py-5">
                  <button
                    onClick={() =>
                      onView(review)
                    }
                    className="rounded-xl bg-slate-100 p-2 transition hover:bg-slate-200"
                  >
                    <Eye size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}