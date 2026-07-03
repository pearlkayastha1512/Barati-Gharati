// "use client";

// import {
//   CheckCircle2,
//   Circle,
//   Pencil,
//   Trash2,
//   CalendarDays,
// } from "lucide-react";

// import { PlannerTask } from "@/types/planner";

// interface Props {
//   task: PlannerTask;

//   onEdit: (task: PlannerTask) => void;

//   onDelete: (id: string) => void;

//   onToggle: (id: string) => void;
// }

// export default function PlannerTaskCard({
//   task,
//   onEdit,
//   onDelete,
//   onToggle,
// }: Props) {
//   return (
//     <div
//       className="
//         rounded-3xl
//         border
//         border-gray-200
//         bg-white
//         p-6
//         shadow-sm
//         transition-all
//         duration-300
//         hover:shadow-lg
//       "
//     >
//       <div className="flex items-start justify-between">

//         {/* Left */}

//         <div className="flex items-start gap-4">

//           <button
//             type="button"
//             onClick={() => onToggle(task.id)}
//             className="
//               mt-1
//               rounded-full
//               transition-all
//               duration-200
//               hover:scale-110
//               active:scale-95
//             "
//           >
//             {task.status === "completed" ? (
//               <CheckCircle2
//                 size={24}
//                 className="text-green-500"
//               />
//             ) : (
//               <Circle
//                 size={24}
//                 className="text-gray-300 transition hover:text-rose-500"
//               />
//             )}
//           </button>

//           <div>

//             <h3
//               className={`text-lg font-semibold transition-all duration-300 ${
//                 task.status === "completed"
//                   ? "text-gray-400 line-through"
//                   : "text-gray-900"
//               }`}
//             >
//               {task.title}
//             </h3>

//             <p
//               className={`mt-2 transition ${
//                 task.status === "completed"
//                   ? "text-gray-400"
//                   : "text-gray-500"
//               }`}
//             >
//               {task.description}
//             </p>

//           </div>

//         </div>

//         {/* Right */}

//         <div className="flex gap-2">

//           <button
//             onClick={() => onEdit(task)}
//             className="
//               rounded-xl
//               border
//               p-2
//               transition
//               hover:bg-gray-100
//             "
//           >
//             <Pencil size={18} />
//           </button>

//           <button
//             onClick={() => onDelete(task.id)}
//             className="
//               rounded-xl
//               border
//               border-red-200
//               p-2
//               text-red-500
//               transition
//               hover:bg-red-50
//             "
//           >
//             <Trash2 size={18} />
//           </button>

//         </div>

//       </div>

//       <div className="mt-6 flex flex-wrap items-center gap-4">

//         <span className="rounded-full bg-rose-50 px-3 py-1 text-sm font-semibold capitalize text-rose-600">
//           {task.priority}
//         </span>

//         <span
//           className={`rounded-full px-3 py-1 text-sm font-semibold capitalize ${
//             task.status === "completed"
//               ? "bg-green-100 text-green-700"
//               : "bg-yellow-100 text-yellow-700"
//           }`}
//         >
//           {task.status}
//         </span>

//         <span className="flex items-center gap-2 text-sm text-gray-500">

//           <CalendarDays size={16} />

//           {new Date(task.dueDate).toLocaleDateString(
//             "en-GB",
//             {
//               day: "2-digit",
//               month: "short",
//               year: "numeric",
//             }
//           )}

//         </span>

//       </div>
//     </div>
//   );
// }

"use client";

import {
  Check,
  Pencil,
  Trash2,
  CalendarDays,
} from "lucide-react";

import { PlannerTask } from "@/types/planner";

interface Props {
  task: PlannerTask;
  onEdit: (task: PlannerTask) => void;
  onDelete: (id: string) => void;
  onToggle: (id: string) => void;
}

export default function PlannerTaskCard({
  task,
  onEdit,
  onDelete,
  onToggle,
}: Props) {
  return (
    <div
      className="
        rounded-3xl
        border
        border-gray-200
        bg-white
        p-6
        shadow-sm
        transition-all
        duration-300
        hover:shadow-lg
      "
    >
      <div className="flex items-start justify-between">
        {/* Left */}
        <div className="flex items-start gap-4">
          {/* Toggle Button */}
          <button
            type="button"
            onClick={() => onToggle(task.id)}
            className="
              mt-1
              flex
              h-7
              w-7
              items-center
              justify-center
              rounded-full
              transition-all
              duration-200
              hover:scale-110
              active:scale-95
            "
          >
            {task.status === "completed" ? (
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-green-500 transition-all duration-300">
                <Check
                  size={16}
                  className="text-white"
                />
              </div>
            ) : (
              <div className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-gray-300 transition-all duration-300">
                <div className="h-2.5 w-2.5 rounded-full bg-transparent" />
              </div>
            )}
          </button>

          <div>
            <h3
              className={`text-lg font-semibold transition-all duration-300 ${
                task.status === "completed"
                  ? "text-gray-400 line-through"
                  : "text-gray-700"
              }`}
            >
              {task.title}
            </h3>

            <p
              className={`mt-2 transition ${
                task.status === "completed"
                  ? "text-gray-400"
                  : "text-gray-500"
              }`}
            >
              {task.description}
            </p>
          </div>
        </div>

        {/* Right */}
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(task)}
            className="
              rounded-xl
              border
              border-gray-200
              p-2
              text-gray-600
              transition
              hover:bg-gray-100
            "
          >
            <Pencil size={18} />
          </button>

          <button
            onClick={() => onDelete(task.id)}
            className="
              rounded-xl
              border
              border-red-200
              p-2
              text-red-500
              transition
              hover:bg-red-50
            "
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-4">
        <span className="rounded-full bg-rose-50 px-3 py-1 text-sm font-semibold capitalize text-rose-600">
          {task.priority}
        </span>

        <span
          className={`rounded-full px-3 py-1 text-sm font-semibold capitalize ${
            task.status === "completed"
              ? "bg-green-100 text-green-700"
              : "bg-yellow-100 text-yellow-700"
          }`}
        >
          {task.status}
        </span>

        <span className="flex items-center gap-2 text-sm text-gray-500">
          <CalendarDays size={16} />

          {new Date(task.dueDate).toLocaleDateString(
            "en-GB",
            {
              day: "2-digit",
              month: "short",
              year: "numeric",
            }
          )}
        </span>
      </div>
    </div>
  );
}