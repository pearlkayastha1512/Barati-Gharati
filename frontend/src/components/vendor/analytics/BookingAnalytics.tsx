// "use client";

// import { useMemo } from "react";

// import { useBookingStore } from "@/store/bookingStore";

// const months = [
//   "Jan",
//   "Feb",
//   "Mar",
//   "Apr",
//   "May",
//   "Jun",
//   "Jul",
//   "Aug",
//   "Sep",
//   "Oct",
//   "Nov",
//   "Dec",
// ];

// export default function BookingAnalytics() {
//   const bookings = useBookingStore(
//     (state) => state.bookings
//   );

//   const currentYear =
//     new Date().getFullYear();

//   const {
//     chartData,
//     maxBookings,
//   } = useMemo(() => {
//     const monthly =
//       new Array(12).fill(0);

//     bookings.forEach((booking) => {
//       if (
//         booking.bookingStatus ===
//         "cancelled"
//       ) {
//         return;
//       }

//       const date = new Date(
//         booking.createdAt
//       );

//       if (
//         date.getFullYear() !==
//         currentYear
//       ) {
//         return;
//       }

//       monthly[
//         date.getMonth()
//       ]++;
//     });

//     return {
//       chartData: months.map(
//         (month, index) => ({
//           month,
//           total: monthly[index],
//         })
//       ),

//       maxBookings: Math.max(
//         ...monthly,
//         1
//       ),
//     };
//   }, [bookings, currentYear]);

//   return (
//     <section className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">

//       <div className="flex items-center justify-between">

//         <div>

//           <h2 className="text-2xl font-bold text-slate-900">
//             Booking Trend
//           </h2>

//           <p className="mt-1 text-sm text-slate-500">
//             Monthly bookings for {currentYear}
//           </p>

//         </div>

//         <div className="rounded-xl bg-[#fff8ef] px-4 py-2 text-sm font-semibold text-[#e4005a]">
//           {bookings.length} Total
//         </div>

//       </div>

//       <div className="relative mt-10">

//         {/* Grid */}

//         <div className="absolute inset-0 flex flex-col justify-between">

//           {[0, 1, 2, 3, 4].map(
//             (line) => (
//               <div
//                 key={line}
//                 className="border-t border-dashed border-slate-200"
//               />
//             )
//           )}

//         </div>

//         <div className="relative flex h-80 items-end justify-between gap-3">

//           {chartData.map(
//             (item) => {
//               const height =
//                 (item.total /
//                   maxBookings) *
//                 100;

//               return (
//                 <div
//                   key={item.month}
//                   className="flex flex-1 flex-col items-center"
//                 >

//                   <span className="mb-2 text-sm font-semibold text-slate-700">
//                     {item.total}
//                   </span>

//                   <div
//                     className="w-full rounded-t-2xl bg-gradient-to-t from-[#e4005a] via-[#e4005a] to-[#ffb703] transition-all duration-500 hover:opacity-90"
//                     style={{
//                       height: `${Math.max(
//                         height,
//                         6
//                       )}%`,
//                     }}
//                   />

//                   <span className="mt-3 text-sm font-medium text-slate-500">
//                     {item.month}
//                   </span>

//                 </div>
//               );
//             }
//           )}

//         </div>

//       </div>

//     </section>
//   );
// }


"use client";

import { useMemo } from "react";
import { useBookingStore } from "@/store/bookingStore";

const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export default function BookingAnalytics() {
  const bookings = useBookingStore((state) => state.bookings);

  const currentYear = new Date().getFullYear();

  const { chartData, maxBookings } = useMemo(() => {
    const monthly = new Array(12).fill(0);

    bookings.forEach((booking) => {
      if (
        booking.bookingStatus?.toLowerCase() === "cancelled"
      ) {
        return;
      }

      const date = new Date(booking.createdAt);

      if (isNaN(date.getTime())) return;

      if (date.getFullYear() !== currentYear) {
        return;
      }

      monthly[date.getMonth()]++;
    });

    return {
      chartData: months.map((month, index) => ({
        month,
        total: monthly[index],
      })),
      maxBookings: Math.max(...monthly, 1),
    };
  }, [bookings, currentYear]);

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">
            Booking Trend
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Monthly bookings for {currentYear}
          </p>
        </div>

        <div className="rounded-xl bg-[#fff8ef] px-4 py-2 text-sm font-semibold text-[#e4005a]">
          {bookings.length} Total
        </div>
      </div>

      {/* Chart */}
      <div className="relative mt-10 h-80">
        {/* Grid Lines */}
        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
          {[0, 1, 2, 3, 4].map((line) => (
            <div
              key={line}
              className="border-t border-dashed border-slate-200"
            />
          ))}
        </div>

        {/* Bars */}
        <div className="relative flex h-full items-end justify-between gap-4">
          {chartData.map((item) => {
            const height =
              (item.total / maxBookings) * 100;

            return (
              <div
                key={item.month}
                className="flex h-full flex-1 flex-col justify-end items-center"
              >
                <span className="mb-2 text-sm font-semibold text-slate-700">
                  {item.total}
                </span>

                {/* Fixed-height container */}
                <div className="flex h-64 w-full items-end">
                  <div
                    className="w-full rounded-t-2xl bg-gradient-to-t from-[#e4005a] via-[#e4005a] to-[#ffb703] transition-all duration-700 hover:opacity-90"
                    style={{
                      height:
                        item.total === 0
                          ? "6px"
                          : `${height}%`,
                    }}
                  />
                </div>

                <span className="mt-3 text-sm font-medium text-slate-500">
                  {item.month}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}