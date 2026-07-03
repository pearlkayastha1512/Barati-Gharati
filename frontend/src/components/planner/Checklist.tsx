

"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

import PlannerTaskCard from "./PlannerTaskCard";
import EditTaskModal from "./EditTaskModal";

import { usePlannerStore } from "@/store/plannerStore";
import { PlannerTask } from "@/types/planner";

export default function Checklist() {
  const tasks = usePlannerStore(
    (state) => state.tasks
  );

  const loadTasks = usePlannerStore(
    (state) => state.loadTasks
  );

  const deleteTask = usePlannerStore(
    (state) => state.deleteTask
  );

  const toggleTask = usePlannerStore(
    (state) => state.toggleTask
  );

  const [selectedTask, setSelectedTask] =
    useState<PlannerTask | null>(null);

  const [openEditModal, setOpenEditModal] =
    useState(false);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  const completedTasks = tasks.filter(
    (task) => task.status === "completed"
  ).length;

  return (
    <>
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
          text-gray-700
        "
      >
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-700">
              Wedding Checklist
            </h2>

            <p className="mt-1 text-gray-500">
              Stay on top of every important task.
            </p>
          </div>

          <span className="rounded-full bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-700">
            {completedTasks} / {tasks.length} Completed
          </span>
        </div>

        {tasks.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-200 py-12 text-center text-gray-500">
            No planner tasks yet.
          </div>
        ) : (
          <div className="space-y-5">
            {tasks.map((task, index) => (
              <motion.div
                key={task.id}
                initial={{
                  opacity: 0,
                  y: 15,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  delay: index * 0.05,
                }}
              >
                <PlannerTaskCard
                  task={task}
                  onToggle={toggleTask}
                  onDelete={deleteTask}
                  onEdit={(task) => {
                    setSelectedTask(task);
                    setOpenEditModal(true);
                  }}
                />
              </motion.div>
            ))}
          </div>
        )}
      </motion.section>

      <EditTaskModal
        open={openEditModal}
        task={selectedTask}
        onClose={() => {
          setOpenEditModal(false);
          setSelectedTask(null);
        }}
      />
    </>
  );
}