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
        new Date(a.date).getTime() -
        new Date(b.date).getTime()
    );
  }, [tasks]);

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="
        rounded-3xl
        border
        border-[#ffb3bf]
        bg-white
        p-7
        shadow-sm
      "
    >
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-[#3f1d2f]">
          Planning Timeline
        </h2>

        <p className="mt-1 text-[#8d6171]">
          Upcoming planner milestones.
        </p>
      </div>

      {timeline.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#ffb3bf] py-12 text-center text-[#8d6171]">
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
                    "COMPLETED"
                      ? "bg-[#ff8fa1]"
                      : "bg-[#ffe6eb]"
                  }`}
                />
              )}

              <div
                className={`relative z-10 flex h-9 w-9 items-center justify-center rounded-full ${
                  task.status ===
                  "COMPLETED"
                    ? "bg-[#fff8d8]"
                    : "bg-[#ffe6eb]"
                }`}
              >
                {task.status ===
                "COMPLETED" ? (
                  <CheckCircle2
                    size={20}
                    className="text-[#111111]"
                  />
                ) : (
                  <CalendarDays
                    size={18}
                    className="text-[#ff4d6d]"
                  />
                )}
              </div>

              <div className="flex-1 rounded-2xl border border-[#fff3b0] p-4 transition hover:border-[#ff8fa1] hover:bg-[#ffe6eb]/30">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-[#3f1d2f]">
                      {task.title}
                    </h3>

                    {task.description && (
                      <p className="mt-1 text-sm text-[#8d6171]">
                        {task.description}
                      </p>
                    )}
                  </div>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                      task.status ===
                      "COMPLETED"
                        ? "bg-[#fff8d8] text-[#111111]"
                        : "bg-[#ffe6eb] text-[#ff4d6d]"
                    }`}
                  >
                    {task.status.toLowerCase()}
                  </span>
                </div>

                <p className="mt-3 text-sm text-[#8d6171]">
                  {new Date(
                    task.date
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