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
//         border-[#ffb3bf]
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
//                 className="text-[#ff4d6d]"
//               />
//             ) : (
//               <Circle
//                 size={24}
//                 className="text-gray-300 transition hover:text-[#ff4d6d]"
//               />
//             )}
//           </button>

//           <div>

//             <h3
//               className={`text-lg font-semibold transition-all duration-300 ${
//                 task.status === "completed"
//                   ? "text-[#ff8fa1] line-through"
//                   : "text-[#3f1d2f]"
//               }`}
//             >
//               {task.title}
//             </h3>

//             <p
//               className={`mt-2 transition ${
//                 task.status === "completed"
//                   ? "text-[#ff8fa1]"
//                   : "text-[#8d6171]"
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
//               hover:bg-[#fff8d8]
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
//               text-[#e63b5f]
//               transition
//               hover:bg-red-50
//             "
//           >
//             <Trash2 size={18} />
//           </button>

//         </div>

//       </div>

//       <div className="mt-6 flex flex-wrap items-center gap-4">

//         <span className="rounded-full bg-[#ffe6eb] px-3 py-1 text-sm font-semibold capitalize text-[#ff4d6d]">
//           {task.priority}
//         </span>

//         <span
//           className={`rounded-full px-3 py-1 text-sm font-semibold capitalize ${
//             task.status === "completed"
//               ? "bg-[#fff8d8] text-[#111111]"
//               : "bg-[#fff3b0] text-[#111111]"
//           }`}
//         >
//           {task.status}
//         </span>

//         <span className="flex items-center gap-2 text-sm text-[#8d6171]">

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

  onEdit: (
    task: PlannerTask
  ) => void;

  onDelete: (
    id: string
  ) => Promise<void>;

  onToggle: (
    id: string,
    status: "PENDING" | "COMPLETED"
  ) => Promise<void>;
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
        border-[#ffb3bf]
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
            onClick={() =>
  onToggle(
    task.id,
    task.status === "COMPLETED"
      ? "PENDING"
      : "COMPLETED"
  )
}
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
            {task.status === "COMPLETED" ? (
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#ff4d6d] transition-all duration-300">
                <Check
                  size={16}
                  className="text-white"
                />
              </div>
            ) : (
              <div className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-[#ffb3bf] transition-all duration-300">
                <div className="h-2.5 w-2.5 rounded-full bg-transparent" />
              </div>
            )}
          </button>

          <div>
            <h3
              className={`text-lg font-semibold transition-all duration-300 ${
                task.status === "COMPLETED"
                  ? "text-[#ff8fa1] line-through"
                  : "text-[#6c2d45]"
              }`}
            >
              {task.title}
            </h3>

            <p
              className={`mt-2 transition ${
                task.status === "COMPLETED"
                  ? "text-[#ff8fa1]"
                  : "text-[#8d6171]"
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
              border-[#ffb3bf]
              p-2
              text-[#7a4a5c]
              transition
              hover:bg-[#fff8d8]
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
              text-[#e63b5f]
              transition
              hover:bg-red-50
            "
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-4">
        <span className="rounded-full bg-[#ffe6eb] px-3 py-1 text-sm font-semibold capitalize text-[#ff4d6d]">
          {String(task.priority).toLowerCase()}
        </span>

        <span
          className={`rounded-full px-3 py-1 text-sm font-semibold capitalize ${
            task.status === "COMPLETED"
              ? "bg-[#fff8d8] text-[#111111]"
              : "bg-[#fff3b0] text-[#111111]"
          }`}
        >
          {task.status}
        </span>

        <span className="flex items-center gap-2 text-sm text-[#8d6171]">
          <CalendarDays size={16} />

          {new Date(task.date).toLocaleDateString(
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