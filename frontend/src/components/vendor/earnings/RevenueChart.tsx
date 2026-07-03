// "use client";

// const months = [
//   "Jan",
//   "Feb",
//   "Mar",
//   "Apr",
//   "May",
//   "Jun",
// ];

// const heights = [
//   "40%",
//   "60%",
//   "80%",
//   "55%",
//   "90%",
//   "70%",
// ];

// export default function RevenueChart() {
//   return (
//     <section className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
//       <h2 className="text-2xl font-bold text-gray-800">
//         Revenue Overview
//       </h2>

//       <div className="mt-10 flex h-72 items-end justify-between">
//         {months.map((month, index) => (
//           <div
//             key={month}
//             className="flex flex-col items-center gap-3"
//           >
//             <div
//               className="w-12 rounded-t-xl bg-gradient-to-t from-blue-700 to-indigo-500 transition-all duration-300 hover:opacity-90"
//               style={{
//                 height: heights[index],
//               }}
//             />

//             <span className="text-sm font-medium text-gray-500">
//               {month}
//             </span>
//           </div>
//         ))}
//       </div>
//     </section>
//   );
// }

"use client";

import { ReactNode, useMemo } from "react";
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  BarChart3,
} from "lucide-react";

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

interface CardProps {
  icon: ReactNode;
  title: string;
  value: string;
  subtitle: string;
  bg: string;
}

function Card({
  icon,
  title,
  value,
  subtitle,
  bg,
}: CardProps) {
  return (
    <div
      className={`rounded-3xl border border-slate-200 ${bg} p-6`}
    >
      <div className="flex items-center gap-3">
        <div className="rounded-2xl bg-white p-3 shadow-sm">
          {icon}
        </div>

        <div>
          <p className="text-sm font-medium text-slate-500">
            {title}
          </p>

          <h3 className="mt-1 text-2xl font-bold text-slate-900">
            {value}
          </h3>

          {subtitle && (
            <p className="mt-1 text-sm text-slate-500">
              {subtitle}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default function RevenueChart() {
  const bookings = useBookingStore(
    (state) => state.bookings
  );

  const currentYear = new Date().getFullYear();

  const {
    chartData,
    maxRevenue,
    totalRevenue,
    highestMonth,
    lowestMonth,
    averageRevenue,
  } = useMemo(() => {
    const revenue = new Array(12).fill(0);

    bookings.forEach((booking) => {
      if (
        booking.bookingStatus ===
        "cancelled"
      ) {
        return;
      }

      const date = new Date(
        booking.eventDate
      );

      if (
        date.getFullYear() !==
        currentYear
      ) {
        return;
      }

      revenue[date.getMonth()] +=
        booking.advancePaid;
    });

    const chartData = months.map(
      (month, index) => ({
        month,
        revenue: revenue[index],
      })
    );

    const maxRevenue = Math.max(
      ...revenue,
      1
    );

    const totalRevenue = revenue.reduce(
      (sum, value) => sum + value,
      0
    );

    const averageRevenue = Math.round(
      totalRevenue / 12
    );

    const highestMonth =
      chartData.reduce((a, b) =>
        a.revenue > b.revenue ? a : b
      );

    const lowestMonth =
      chartData.reduce((a, b) =>
        a.revenue < b.revenue ? a : b
      );

    return {
      chartData,
      maxRevenue,
      totalRevenue,
      highestMonth,
      lowestMonth,
      averageRevenue,
    };
  }, [bookings, currentYear]);

  return (
    <section className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-sm">
      {/* Header */}
      <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">
            Revenue Overview
          </h2>

          <p className="mt-2 text-slate-500">
            Monthly revenue comparison for the current year
          </p>
        </div>

        {/* <select className="rounded-2xl border border-slate-200 bg-white px-5 py-3 font-medium text-slate-700 outline-none">
          <option>This Year</option>
        </select> */}
      </div>

      {/* Stats */}
      <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <Card
          icon={
            <Wallet className="h-6 w-6 text-blue-600" />
          }
          title="Total Revenue"
          value={`₹${totalRevenue.toLocaleString(
            "en-IN"
          )}`}
          subtitle="Current Year"
          bg="bg-blue-50"
        />

        <Card
          icon={
            <TrendingUp className="h-6 w-6 text-green-600" />
          }
          title="Highest Month"
          value={`₹${highestMonth.revenue.toLocaleString(
            "en-IN"
          )}`}
          subtitle={highestMonth.month}
          bg="bg-green-50"
        />

        <Card
          icon={
            <TrendingDown className="h-6 w-6 text-violet-600" />
          }
          title="Lowest Month"
          value={`₹${lowestMonth.revenue.toLocaleString(
            "en-IN"
          )}`}
          subtitle={lowestMonth.month}
          bg="bg-violet-50"
        />

        <Card
          icon={
            <BarChart3 className="h-6 w-6 text-orange-600" />
          }
          title="Monthly Average"
          value={`₹${averageRevenue.toLocaleString(
            "en-IN"
          )}`}
          subtitle="Per Month"
          bg="bg-orange-50"
        />
      </div>

      {/* Chart */}
      <div className="mt-10 rounded-3xl border border-slate-200 bg-slate-50 p-6">
        <div className="flex h-80 items-end justify-between gap-3">
          {chartData.map((item) => {
            const height =
              (item.revenue / maxRevenue) *
              100;

            return (
              <div
                key={item.month}
                className="flex flex-1 flex-col items-center"
              >
                <span className="mb-2 text-xs font-medium text-slate-500">
                  {item.revenue > 0
                    ? `₹${item.revenue.toLocaleString(
                        "en-IN"
                      )}`
                    : ""}
                </span>

                <div className="flex h-60 w-full items-end justify-center">
                  <div
                    className="w-full max-w-[38px] rounded-t-2xl bg-gradient-to-t from-blue-600 to-blue-400 transition-all duration-500"
                    style={{
                      height: `${Math.max(
                        height,
                        4
                      )}%`,
                    }}
                  />
                </div>

                <span className="mt-3 text-sm font-medium text-slate-600">
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