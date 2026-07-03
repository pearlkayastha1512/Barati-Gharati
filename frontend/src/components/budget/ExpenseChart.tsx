

// "use client";

// import { useMemo } from "react";

// import {
//   TrendingDown,
//   TrendingUp,
// } from "lucide-react";

// import { useExpenseStore } from "@/store/expenseStore";

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

// export default function ExpenseChart() {
//   const expenses = useExpenseStore(
//     (state) => state.expenses
//   );

//   const {
//     chartData,
//     highestCategory,
//     lowestCategory,
//     totalSpent,
//   } = useMemo(() => {
//     const monthly = Array(12).fill(0);

//     const categoryTotals: Record<
//       string,
//       number
//     > = {};

//     expenses.forEach((expense) => {
//       const date = new Date(
//         expense.expenseDate
//       );

//       monthly[
//         date.getMonth()
//       ] += expense.amount;

//       categoryTotals[
//         expense.category
//       ] =
//         (categoryTotals[
//           expense.category
//         ] || 0) + expense.amount;
//     });

//     const maxValue =
//       Math.max(...monthly, 1);

//     const chartData = monthly.map(
//       (amount, index) => ({
//         month: months[index],

//         amount,

//         height:
//           (amount / maxValue) * 100,
//       })
//     );

//     const sortedCategories =
//       Object.entries(
//         categoryTotals
//       ).sort(
//         (a, b) =>
//           b[1] - a[1]
//       );

//     return {
//       chartData,

//       highestCategory:
//         sortedCategories[0]?.[0] ??
//         "-",

//       lowestCategory:
//         sortedCategories.at(-1)?.[0] ??
//         "-",

//       totalSpent: expenses.reduce(
//         (sum, expense) =>
//           sum + expense.amount,
//         0
//       ),
//     };
//   }, [expenses]);

//   return (
//     <section className="rounded-3xl border border-gray-200 bg-white p-7 shadow-sm">

//       <div className="flex items-center justify-between">

//         <div>

//           <h2 className="text-2xl font-bold text-gray-900">
//             Expense Analytics
//           </h2>

//           <p className="mt-1 text-gray-500">
//             Monthly wedding spending.
//           </p>

//         </div>

//         <div className="rounded-2xl bg-green-50 px-4 py-2 text-green-600">

//           <div className="flex items-center gap-2">

//             <TrendingUp size={18} />

//             ₹
//             {totalSpent.toLocaleString(
//               "en-IN"
//             )}

//           </div>

//         </div>

//       </div>

//       <div className="mt-10 flex h-72 items-end justify-between gap-4">
//   {chartData.map((item) => (
//     <div
//       key={item.month}
//       className="flex h-full flex-1 flex-col justify-end items-center"
//     >
//       <div
//         style={{
//         height: `${Math.max(item.height * 2.5, 8)}px`,
//         }}
//         className="
//           w-full
//           rounded-t-2xl
//           bg-gradient-to-t
//           from-emerald-500
//           to-green-300
//           transition-all
//           duration-500
//           hover:scale-105
//         "
//       />

//       <span className="mt-3 text-sm text-gray-500">
//         {item.month}
//       </span>
//     </div>
//   ))}
// </div>

//       <div className="mt-8 grid gap-4 md:grid-cols-3">

//         <div className="rounded-2xl bg-gray-50 p-4">

//           <p className="text-sm text-gray-500">
//             Highest Expense
//           </p>

//           <p className="mt-2 font-bold text-gray-900">
//             {highestCategory}
//           </p>

//         </div>

//         <div className="rounded-2xl bg-gray-50 p-4">

//           <p className="text-sm text-gray-500">
//             Lowest Expense
//           </p>

//           <p className="mt-2 font-bold text-gray-900">
//             {lowestCategory}
//           </p>

//         </div>

//         <div className="rounded-2xl bg-gray-50 p-4">

//           <div className="flex items-center gap-2">

//             <TrendingDown
//               size={18}
//               className="text-orange-500"
//             />

//             <p className="font-bold text-orange-500">
//               Live Analytics
//             </p>

//           </div>

//           <p className="mt-2 text-sm text-gray-500">
//             Updated automatically with every expense.
//           </p>

//         </div>

//       </div>

//     </section>
//   );
// }

"use client";

import { useMemo } from "react";

import {
  TrendingDown,
  TrendingUp,
} from "lucide-react";

import { useExpenseStore } from "@/store/expenseStore";

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

const MAX_BAR_HEIGHT = 220;

export default function ExpenseChart() {
  const expenses = useExpenseStore(
    (state) => state.expenses
  );

  const {
    chartData,
    highestCategory,
    lowestCategory,
    totalSpent,
  } = useMemo(() => {
    const monthly = Array(12).fill(0);

    const categoryTotals: Record<
      string,
      number
    > = {};

    expenses.forEach((expense) => {
      const date = new Date(
        expense.expenseDate
      );

      monthly[date.getMonth()] +=
        expense.amount;

      categoryTotals[expense.category] =
        (categoryTotals[
          expense.category
        ] || 0) + expense.amount;
    });

    const maxMonthlyExpense =
      Math.max(...monthly, 1);

    const chartData = monthly.map(
      (amount, index) => ({
        month: months[index],
        amount,

        height:
          amount === 0
            ? 8
            : Math.max(
                (amount /
                  maxMonthlyExpense) *
                  MAX_BAR_HEIGHT,
                8
              ),
      })
    );

    const sortedCategories =
      Object.entries(
        categoryTotals
      ).sort(
        (a, b) =>
          b[1] - a[1]
      );

    return {
      chartData,

      highestCategory:
        sortedCategories[0]?.[0] ??
        "-",

      lowestCategory:
        sortedCategories.at(-1)?.[0] ??
        "-",

      totalSpent: expenses.reduce(
        (sum, expense) =>
          sum + expense.amount,
        0
      ),
    };
  }, [expenses]);

  return (
    <section className="rounded-3xl border border-gray-200 bg-white p-7 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Expense Analytics
          </h2>

          <p className="mt-1 text-gray-500">
            Monthly wedding spending.
          </p>
        </div>

        <div className="rounded-2xl bg-green-50 px-4 py-2 text-green-600">
          <div className="flex items-center gap-2">
            <TrendingUp size={18} />

            ₹
            {totalSpent.toLocaleString(
              "en-IN"
            )}
          </div>
        </div>
      </div>

      <div className="mt-10 flex h-72 items-end justify-between gap-4">
        {chartData.map((item) => (
          <div
            key={item.month}
            className="flex h-full flex-1 flex-col justify-end items-center"
          >
            <div
              style={{
                height: `${item.height}px`,
              }}
              className="
                w-full
                rounded-t-2xl
                bg-gradient-to-t
                from-emerald-500
                to-green-300
                transition-all
                duration-500
                hover:scale-105
              "
            />

            <span className="mt-3 text-sm text-gray-500">
              {item.month}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl bg-gray-50 p-4">
          <p className="text-sm text-gray-500">
            Highest Expense
          </p>

          <p className="mt-2 font-bold text-gray-900">
            {highestCategory}
          </p>
        </div>

        <div className="rounded-2xl bg-gray-50 p-4">
          <p className="text-sm text-gray-500">
            Lowest Expense
          </p>

          <p className="mt-2 font-bold text-gray-900">
            {lowestCategory}
          </p>
        </div>

        <div className="rounded-2xl bg-gray-50 p-4">
          <div className="flex items-center gap-2">
            <TrendingDown
              size={18}
              className="text-orange-500"
            />

            <p className="font-bold text-orange-500">
              Live Analytics
            </p>
          </div>

          <p className="mt-2 text-sm text-gray-500">
            Updated automatically with every expense.
          </p>
        </div>
      </div>
    </section>
  );
}