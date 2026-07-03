"use client";

import { useEffect, useMemo } from "react";

import { motion } from "framer-motion";

import {
  CheckCircle2,
  Clock3,
  ListTodo,
  Target,
} from "lucide-react";

import { usePlannerStore } from "@/store/plannerStore";

export default function ProgressOverview() {
  const tasks = usePlannerStore(
    (state) => state.tasks
  );

  const loadTasks = usePlannerStore(
    (state) => state.loadTasks
  );

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  const stats = useMemo(() => {
    const totalTasks = tasks.length;

    const completedTasks = tasks.filter(
      (task) =>
        task.status === "completed"
    ).length;

    const pendingTasks =
      totalTasks - completedTasks;

    const progress =
      totalTasks === 0
        ? 0
        : Math.round(
            (completedTasks /
              totalTasks) *
              100
          );

    return [
      {
        title: "Total Tasks",
        value: totalTasks.toString(),
        subtitle: "Wedding checklist",
        icon: ListTodo,
      },
      {
        title: "Completed",
        value: completedTasks.toString(),
        subtitle: "Finished tasks",
        icon: CheckCircle2,
      },
      {
        title: "Pending",
        value: pendingTasks.toString(),
        subtitle: "Still remaining",
        icon: Clock3,
      },
      {
        title: "Progress",
        value: `${progress}%`,
        subtitle: "Overall completion",
        icon: Target,
      },
    ];
  }, [tasks]);

  return (
    <section className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((item, index) => {
        const Icon = item.icon;

        return (
          <motion.div
            key={item.title}
            initial={{
              opacity: 0,
              y: 15,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              delay: index * 0.08,
            }}
            className="
              rounded-3xl
              border
              border-gray-200
              bg-white
              p-6
              shadow-sm
              transition-all
              duration-300
              hover:-translate-y-1
              hover:shadow-xl
            "
          >
            <div className="flex items-start justify-between">

              <div className="rounded-2xl bg-rose-50 p-3">

                <Icon
                  size={24}
                  className="text-rose-500"
                />

              </div>

              <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-600">
                Live
              </span>

            </div>

            <h3 className="mt-6 text-sm text-gray-500">
              {item.title}
            </h3>

            <p className="mt-2 text-4xl font-bold text-gray-900">
              {item.value}
            </p>

            <p className="mt-2 text-sm text-gray-500">
              {item.subtitle}
            </p>

          </motion.div>
        );
      })}
    </section>
  );
}