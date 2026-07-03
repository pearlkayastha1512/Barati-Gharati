// "use client";

// import { useEffect, useState } from "react";

// import { X } from "lucide-react";
// import { toast } from "sonner";

// import { Expense } from "@/types/expense";
// import { useExpenseStore } from "@/store/expenseStore";
// import { useAuthStore } from "@/store/authStore";

// interface ExpenseModalProps {
//   open: boolean;

//   onClose: () => void;

//   expense?: Expense;
// }

// const categories = [
//   "Venue",
//   "Photographer",
//   "Videographer",
//   "Decorator",
//   "Makeup Artist",
//   "Mehendi Artist",
//   "Caterer",
//   "DJ",
//   "Entertainment",
//   "Wedding Planner",
//   "Transportation",
//   "Accommodation",
//   "Invitation",
//   "Jewellery",
//   "Outfits",
//   "Miscellaneous",
// ];

// export default function ExpenseModal({
//   open,
//   onClose,
//   expense,
// }: ExpenseModalProps) {
//   const { user } = useAuthStore();

//   const addExpense =
//     useExpenseStore(
//       (state) => state.addExpense
//     );

//   const updateExpense =
//     useExpenseStore(
//       (state) => state.updateExpense
//     );

//   const [title, setTitle] =
//     useState("");

//   const [category, setCategory] =
//     useState(categories[0]);

//   const [amount, setAmount] =
//     useState("");

//   const [expenseDate, setExpenseDate] =
//     useState("");

//   const [notes, setNotes] =
//     useState("");

//   useEffect(() => {
//     if (expense) {
//       setTitle(expense.title);

//       setCategory(expense.category);

//       setAmount(
//         expense.amount.toString()
//       );

//       setExpenseDate(
//         expense.expenseDate
//       );

//       setNotes(expense.notes);
//     } else {
//       setTitle("");

//       setCategory(categories[0]);

//       setAmount("");

//       setExpenseDate("");

//       setNotes("");
//     }
//   }, [expense, open]);

//   if (!open) {
//     return null;
//   }

//   function handleSubmit() {
//     if (!user) return;

//     if (
//       !title ||
//       !amount ||
//       !expenseDate
//     ) {
//       toast.error(
//         "Please fill all required fields."
//       );

//       return;
//     }

//     const payload: Expense = {
//       id:
//         expense?.id ??
//         crypto.randomUUID(),

//       customerId: user._id,

//       title,

//       category,

//       amount: Number(amount),

//       expenseDate,

//       notes,

//       createdAt:
//         expense?.createdAt ??
//         new Date().toISOString(),

//       updatedAt:
//         new Date().toISOString(),
//     };

//     if (expense) {
//       updateExpense(payload);

//       toast.success(
//         "Expense updated."
//       );
//     } else {
//       addExpense(payload);

//       toast.success(
//         "Expense added."
//       );
//     }

//     onClose();
//   }

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-5">

//       <div className="w-full max-w-xl rounded-3xl bg-white shadow-2xl">

//         {/* Header */}

//         <div className="flex items-center justify-between border-b px-7 py-5">

//           <h2 className="text-2xl font-bold">

//             {expense
//               ? "Edit Expense"
//               : "Add Expense"}

//           </h2>

//           <button
//             onClick={onClose}
//           >
//             <X />
//           </button>

//         </div>

//         {/* Body */}

//         <div className="space-y-5 p-7">

//           <div>

//             <label className="mb-2 block font-medium">
//               Expense Title
//             </label>

//             <input
//               value={title}
//               onChange={(e) =>
//                 setTitle(
//                   e.target.value
//                 )
//               }
//               className="w-full rounded-xl border p-3 outline-none focus:border-rose-500"
//               placeholder="Invitation Cards"
//             />

//           </div>

//           <div>

//             <label className="mb-2 block font-medium">
//               Category
//             </label>

//             <select
//               value={category}
//               onChange={(e) =>
//                 setCategory(
//                   e.target.value
//                 )
//               }
//               className="w-full rounded-xl border p-3 outline-none focus:border-rose-500"
//             >
//               {categories.map(
//                 (item) => (
//                   <option
//                     key={item}
//                   >
//                     {item}
//                   </option>
//                 )
//               )}
//             </select>

//           </div>

//           <div className="grid gap-5 md:grid-cols-2">

//             <div>

//               <label className="mb-2 block font-medium">
//                 Amount
//               </label>

//               <input
//                 type="number"
//                 value={amount}
//                 onChange={(e) =>
//                   setAmount(
//                     e.target.value
//                   )
//                 }
//                 className="w-full rounded-xl border p-3 outline-none focus:border-rose-500"
//               />

//             </div>

//             <div>

//               <label className="mb-2 block font-medium">
//                 Expense Date
//               </label>

//               <input
//                 type="date"
//                 value={expenseDate}
//                 onChange={(e) =>
//                   setExpenseDate(
//                     e.target.value
//                   )
//                 }
//                 className="w-full rounded-xl border p-3 outline-none focus:border-rose-500"
//               />

//             </div>

//           </div>

//           <div>

//             <label className="mb-2 block font-medium">
//               Notes
//             </label>

//             <textarea
//               rows={4}
//               value={notes}
//               onChange={(e) =>
//                 setNotes(
//                   e.target.value
//                 )
//               }
//               className="w-full rounded-xl border p-3 outline-none focus:border-rose-500"
//             />

//           </div>

//         </div>

//         {/* Footer */}

//         <div className="flex justify-end gap-3 border-t px-7 py-5">

//           <button
//             onClick={onClose}
//             className="rounded-xl border px-5 py-3"
//           >
//             Cancel
//           </button>

//           <button
//             onClick={handleSubmit}
//             className="rounded-xl bg-rose-500 px-6 py-3 font-semibold text-white hover:bg-rose-600"
//           >
//             {expense
//               ? "Update Expense"
//               : "Add Expense"}
//           </button>

//         </div>

//       </div>

//     </div>
//   );
// }

"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { toast } from "sonner";

import { Expense } from "@/types/expense";
import { useExpenseStore } from "@/store/expenseStore";
import { useAuthStore } from "@/store/authStore";

interface ExpenseModalProps {
  open: boolean;
  onClose: () => void;
  expense?: Expense;
}

const categories = [
  "Venue",
  "Photographer",
  "Videographer",
  "Decorator",
  "Makeup Artist",
  "Mehendi Artist",
  "Caterer",
  "DJ",
  "Entertainment",
  "Wedding Planner",
  "Transportation",
  "Accommodation",
  "Invitation",
  "Jewellery",
  "Outfits",
  "Miscellaneous",
];

export default function ExpenseModal({
  open,
  onClose,
  expense,
}: ExpenseModalProps) {
  const { user } = useAuthStore();

  const addExpense = useExpenseStore((state) => state.addExpense);
  const updateExpense = useExpenseStore((state) => state.updateExpense);

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState(categories[0]);
  const [amount, setAmount] = useState("");
  const [expenseDate, setExpenseDate] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (expense) {
      setTitle(expense.title);
      setCategory(expense.category);
      setAmount(expense.amount.toString());
      setExpenseDate(expense.expenseDate);
      setNotes(expense.notes);
    } else {
      setTitle("");
      setCategory(categories[0]);
      setAmount("");
      setExpenseDate("");
      setNotes("");
    }
  }, [expense, open]);

  if (!open) return null;

  function handleSubmit() {
    if (!user) return;

    if (!title || !amount || !expenseDate) {
      toast.error("Please fill all required fields.");
      return;
    }

    const payload: Expense = {
      id: expense?.id ?? crypto.randomUUID(),
      customerId: user._id,
      title,
      category,
      amount: Number(amount),
      expenseDate,
      notes,
      createdAt: expense?.createdAt ?? new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (expense) {
      updateExpense(payload);
      toast.success("Expense updated.");
    } else {
      addExpense(payload);
      toast.success("Expense added.");
    }

    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-5">
      <div className="w-full max-w-xl rounded-3xl bg-white text-gray-700 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b px-7 py-5">
          <h2 className="text-2xl font-bold text-gray-900">
            {expense ? "Edit Expense" : "Add Expense"}
          </h2>

          <button
            onClick={onClose}
            className="text-gray-500 transition hover:text-gray-700"
          >
            <X />
          </button>
        </div>

        {/* Body */}
        <div className="space-y-5 p-7">
          <div>
            <label className="mb-2 block font-medium text-gray-700">
              Expense Title
            </label>

            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Invitation Cards"
              className="w-full rounded-xl border border-gray-300 p-3 text-gray-700 placeholder:text-gray-400 outline-none transition focus:border-rose-500"
            />
          </div>

          <div>
            <label className="mb-2 block font-medium text-gray-700">
              Category
            </label>

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full rounded-xl border border-gray-300 p-3 text-gray-700 outline-none transition focus:border-rose-500"
            >
              {categories.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 block font-medium text-gray-700">
                Amount
              </label>

              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full rounded-xl border border-gray-300 p-3 text-gray-700 outline-none transition focus:border-rose-500"
              />
            </div>

            <div>
              <label className="mb-2 block font-medium text-gray-700">
                Expense Date
              </label>

              <input
                type="date"
                value={expenseDate}
                onChange={(e) => setExpenseDate(e.target.value)}
                className="w-full rounded-xl border border-gray-300 p-3 text-gray-700 outline-none transition focus:border-rose-500"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block font-medium text-gray-700">
              Notes
            </label>

            <textarea
              rows={4}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Enter any additional notes..."
              className="w-full rounded-xl border border-gray-300 p-3 text-gray-700 placeholder:text-gray-400 outline-none transition focus:border-rose-500"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 border-t px-7 py-5">
          <button
            onClick={onClose}
            className="rounded-xl border border-gray-300 px-5 py-3 text-gray-700 transition hover:bg-gray-100"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            className="rounded-xl bg-rose-500 px-6 py-3 font-semibold text-white transition hover:bg-rose-600"
          >
            {expense ? "Update Expense" : "Add Expense"}
          </button>
        </div>
      </div>
    </div>
  );
}