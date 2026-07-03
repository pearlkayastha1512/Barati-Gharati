"use client";

import { useMemo } from "react";

import { useBookingStore } from "@/store/bookingStore";

function statusBadge(status: string) {
  switch (status) {
    case "paid":
      return "bg-green-100 text-green-700";

    case "partial":
      return "bg-yellow-100 text-yellow-700";

    default:
      return "bg-red-100 text-red-700";
  }
}

export default function TransactionsTable() {
  const bookings = useBookingStore(
    (state) => state.bookings
  );

  const transactions = useMemo(() => {
    return [...bookings]
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() -
          new Date(a.createdAt).getTime()
      )
      .map((booking) => ({
        id: booking.id,

        customer:
          booking.customerName,

        event:
          booking.eventType,

        date:
          booking.eventDate,

        amount:
          booking.amount,

        advance:
          booking.advancePaid,

        remaining:
          booking.remainingAmount,

        status:
          booking.paymentStatus,
      }));
  }, [bookings]);

  return (
    <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">

      <div className="border-b border-slate-200 px-6 py-5">

        <h2 className="text-2xl font-bold text-slate-900">
          Recent Transactions
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Payment history from all bookings
        </p>

      </div>

      <div className="overflow-x-auto">

        <table className="min-w-full">

          <thead className="bg-slate-50">

            <tr>

              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">
                Customer
              </th>

              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">
                Event
              </th>

              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">
                Date
              </th>

              <th className="px-6 py-4 text-right text-sm font-semibold text-slate-900">
                Total
              </th>

              <th className="px-6 py-4 text-right text-sm font-semibold text-slate-900">
                Paid
              </th>

              <th className="px-6 py-4 text-right text-sm font-semibold text-slate-900">
                Balance
              </th>

              <th className="px-6 py-4 text-center text-sm font-semibold text-slate-900">
                Status
              </th>

            </tr>

          </thead>

          <tbody>

            {transactions.length === 0 ? (

              <tr>

                <td
                  colSpan={7}
                  className="py-14 text-center text-slate-500"
                >
                  No transactions available.
                </td>

              </tr>

            ) : (

              transactions.map(
                (transaction) => (

                  <tr
                    key={transaction.id}
                    className="border-t border-slate-100 transition hover:bg-slate-50"
                  >

                    <td className="px-6 py-5 font-semibold text-slate-800">
                      {transaction.customer}
                    </td>

                    <td className="px-6 py-5 text-slate-600">
                      {transaction.event}
                    </td>

                    <td className="px-6 py-5 text-slate-600">
                      {transaction.date}
                    </td>

                    <td className="px-6 py-5 text-right font-semibold text-slate-800">
                      ₹
                      {transaction.amount.toLocaleString(
                        "en-IN"
                      )}
                    </td>

                    <td className="px-6 py-5 text-right font-semibold text-green-700">
                      ₹
                      {transaction.advance.toLocaleString(
                        "en-IN"
                      )}
                    </td>

                    <td className="px-6 py-5 text-right font-semibold text-red-600">
                      ₹
                      {transaction.remaining.toLocaleString(
                        "en-IN"
                      )}
                    </td>

                    <td className="px-6 py-5 text-center">

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${statusBadge(
                          transaction.status
                        )}`}
                      >
                        {transaction.status}
                      </span>

                    </td>

                  </tr>
                )
              )

            )}

          </tbody>

        </table>

      </div>

    </section>
  );
}