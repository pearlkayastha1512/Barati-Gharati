"use client";

import { useEffect, useMemo } from "react";

import { motion } from "framer-motion";

import {
  CalendarDays,
  CheckCircle2,
} from "lucide-react";

import { usePlannerStore } from "@/store/plannerStore";

export default function Timeline() {
  const tasks = usePlannerStore(
    (state) => state.tasks
  );

  const loadTasks = usePlannerStore(
    (state) => state.loadTasks
  );

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  const timeline = useMemo(() => {
    return [...tasks].sort(
      (a, b) =>
        new Date(a.dueDate).getTime() -
        new Date(b.dueDate).getTime()
    );
  }, [tasks]);

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="
        rounded-3xl
        border
        border-gray-200
        bg-white
        p-7
        shadow-sm
      "
    >
      <div className="mb-8">

        <h2 className="text-2xl font-bold text-gray-900">
          Planning Timeline
        </h2>

        <p className="mt-1 text-gray-500">
          Upcoming planner milestones.
        </p>

      </div>

      {timeline.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-200 py-12 text-center text-gray-500">
          No planner tasks available.
        </div>
      ) : (
        <div className="relative">

          {timeline.map((task, index) => (

            <div
              key={task.id}
              className="relative flex gap-5 pb-8 last:pb-0"
            >

              {index !==
                timeline.length - 1 && (
                <div
                  className={`absolute left-[17px] top-10 h-full w-[2px] ${
                    task.status ===
                    "completed"
                      ? "bg-green-400"
                      : "bg-gray-200"
                  }`}
                />
              )}

              <div
                className={`relative z-10 flex h-9 w-9 items-center justify-center rounded-full ${
                  task.status ===
                  "completed"
                    ? "bg-green-100"
                    : "bg-rose-100"
                }`}
              >
                {task.status ===
                "completed" ? (
                  <CheckCircle2
                    size={20}
                    className="text-green-600"
                  />
                ) : (
                  <CalendarDays
                    size={18}
                    className="text-rose-500"
                  />
                )}
              </div>

              <div className="flex-1 rounded-2xl border border-gray-100 p-4 transition hover:border-rose-200 hover:bg-rose-50/30">

                <div className="flex items-center justify-between">

                  <div>

                    <h3 className="font-semibold text-gray-900">
                      {task.title}
                    </h3>

                    {task.description && (
                      <p className="mt-1 text-sm text-gray-500">
                        {task.description}
                      </p>
                    )}

                  </div>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                      task.status ===
                      "completed"
                        ? "bg-green-100 text-green-700"
                        : "bg-rose-100 text-rose-600"
                    }`}
                  >
                    {task.status}
                  </span>

                </div>

                <p className="mt-3 text-sm text-gray-500">

                  {new Date(
                    task.dueDate
                  ).toLocaleDateString(
                    "en-GB",
                    {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    }
                  )}

                </p>

              </div>

            </div>

          ))}

        </div>
      )}
    </motion.section>
  );
}