"use client";

import { Eye } from "lucide-react";

import { User } from "@/types/auth";

interface Props {
  customers: User[];

  onView: (customer: User) => void;
}

export default function CustomerTable({
  customers,
  onView,
}: Props) {
  if (customers.length === 0) {
    return (
      <section className="rounded-3xl border border-slate-200 bg-white p-20 text-center shadow-sm">
        <h2 className="text-2xl font-bold text-slate-700">
          No Customers Found
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
                Email
              </th>

              <th className="px-6 py-4 font-semibold text-slate-700">
                Phone
              </th>

              <th className="px-6 py-4 font-semibold text-slate-700">
                Verified
              </th>

              <th className="px-6 py-4 font-semibold text-slate-700">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="text-slate-600">
            {customers.map((customer) => (
              <tr
                key={customer._id}
                className="border-t border-slate-100 hover:bg-slate-50"
              >
                <td className="px-6 py-5">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-700">
                      {customer.name.charAt(0).toUpperCase()}
                    </div>

                    <div>
                      <h3 className="font-semibold text-slate-900">
                        {customer.name}
                      </h3>

                      <p className="text-sm text-slate-500">
                        Customer
                      </p>
                    </div>
                  </div>
                </td>

                <td className="px-6 py-5">
                  {customer.email}
                </td>

                <td className="px-6 py-5">
                  {customer.phone}
                </td>

                <td className="px-6 py-5">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      customer.isVerified
                        ? "bg-green-100 text-green-700"
                        : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {customer.isVerified
                      ? "Verified"
                      : "Unverified"}
                  </span>
                </td>

                <td className="px-6 py-5">
                  <button
                    onClick={() =>
                      onView(customer)
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