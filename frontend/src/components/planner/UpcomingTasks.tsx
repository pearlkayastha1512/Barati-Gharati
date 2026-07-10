"use client";

import { useEffect, useMemo } from "react";

import {
  CalendarClock,
  AlertCircle,
} from "lucide-react";

import { usePlannerStore } from "@/store/plannerStore";

export default function UpcomingTasks() {
  const tasks = usePlannerStore(
    (state) => state.tasks
  );

  const loadTasks = usePlannerStore(
    (state) => state.loadTasks
  );

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  const upcomingTasks = useMemo(() => {
    return [...tasks]
      .filter(
        (task) => task.status === "PENDING"
      )
      .sort(
        (a, b) =>
          new Date(a.date).getTime() -
          new Date(b.date).getTime()
      )
      .slice(0, 5);
  }, [tasks]);

  const getDaysLeft = (date: string) => {
    const today = new Date();

    const due = new Date(date);

    return Math.ceil(
      (due.getTime() - today.getTime()) /
        (1000 * 60 * 60 * 24)
    );
  };

  return (
    <section className="rounded-3xl border border-[#ffb3bf] bg-[#fffdf0] p-7 shadow-sm">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-[#3f1d2f]">
          Upcoming Tasks
        </h2>

        <p className="mt-1 text-[#8d6171]">
          Your next wedding activities.
        </p>
      </div>

      {upcomingTasks.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#ffb3bf] py-12 text-center text-[#8d6171]">
          No upcoming tasks.
        </div>
      ) : (
        <div className="space-y-4">
          {upcomingTasks.map((task) => (
            <div
              key={task.id}
              className="
                rounded-2xl
                border
                border-[#fff3b0]
                p-5
                transition
                hover:border-[#ff8fa1]
                hover:bg-[#ffe6eb]/30
              "
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="rounded-2xl bg-[#ffe6eb] p-3">
                    <CalendarClock
                      size={22}
                      className="text-[#ff4d6d]"
                    />
                  </div>

                  <div>
                    <h3 className="font-semibold text-[#3f1d2f]">
                      {task.title}
                    </h3>

                    {task.description && (
                      <p className="mt-1 text-sm text-[#8d6171]">
                        {task.description}
                      </p>
                    )}

                    <p className="mt-2 text-sm text-[#8d6171]">
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

                <div className="flex flex-col items-end gap-2">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                      task.priority === "HIGH"
                        ? "bg-[#ffe6eb] text-[#e63b5f]"
                        : task.priority ===
                          "MEDIUM"
                        ? "bg-[#fff3b0] text-[#111111]"
                        : "bg-[#fff8d8] text-[#111111]"
                    }`}
                  >
                    {task.priority.toLowerCase()}
                  </span>

                  <div className="flex items-center gap-1 text-sm text-orange-500">
                    <AlertCircle size={14} />

                    {getDaysLeft(task.date)}{" "}
                    days left
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}