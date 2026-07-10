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
        task.status === "COMPLETED"
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
              border-[#ffb3bf]
              bg-[#fffdf0]
              p-6
              shadow-sm
              transition-all
              duration-300
              hover:-translate-y-1
              hover:shadow-xl
            "
          >
            <div className="flex items-start justify-between">

              <div className="rounded-2xl bg-[#ffe6eb] p-3">

                <Icon
                  size={24}
                  className="text-[#ff4d6d]"
                />

              </div>

              <span className="rounded-full bg-[#fff8d8] px-3 py-1 text-xs font-semibold text-[#111111]">
                Live
              </span>

            </div>

            <h3 className="mt-6 text-sm text-[#8d6171]">
              {item.title}
            </h3>

            <p className="mt-2 text-4xl font-bold text-[#3f1d2f]">
              {item.value}
            </p>

            <p className="mt-2 text-sm text-[#8d6171]">
              {item.subtitle}
            </p>

          </motion.div>
        );
      })}
    </section>
  );
}