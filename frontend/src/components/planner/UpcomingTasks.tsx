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
        (task) => task.status === "pending"
      )
      .sort(
        (a, b) =>
          new Date(a.dueDate).getTime() -
          new Date(b.dueDate).getTime()
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
    <section className="rounded-3xl border border-gray-200 bg-white p-7 shadow-sm">

      <div className="mb-6">

        <h2 className="text-2xl font-bold text-gray-900">
          Upcoming Tasks
        </h2>

        <p className="mt-1 text-gray-500">
          Your next wedding activities.
        </p>

      </div>

      {upcomingTasks.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-200 py-12 text-center text-gray-500">
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
                border-gray-100
                p-5
                transition
                hover:border-rose-200
                hover:bg-rose-50/30
              "
            >
              <div className="flex items-start justify-between">

                <div className="flex items-center gap-4">

                  <div className="rounded-2xl bg-rose-100 p-3">

                    <CalendarClock
                      size={22}
                      className="text-rose-500"
                    />

                  </div>

                  <div>

                    <h3 className="font-semibold text-gray-900">
                      {task.title}
                    </h3>

                    <p className="mt-1 text-sm text-gray-500">
                      {task.description}
                    </p>

                    <p className="mt-2 text-sm text-gray-500">
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

                <div className="flex flex-col items-end gap-2">

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                      task.priority === "high"
                        ? "bg-red-100 text-red-600"
                        : task.priority ===
                          "medium"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-green-100 text-green-700"
                    }`}
                  >
                    {task.priority}
                  </span>

                  <div className="flex items-center gap-1 text-sm text-orange-500">

                    <AlertCircle size={14} />

                    {getDaysLeft(task.dueDate)} days left

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