"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { toast } from "sonner";

import { usePlannerStore } from "@/store/plannerStore";
import { TaskPriority } from "@/types/planner";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function AddTaskModal({
  open,
  onClose,
}: Props) {
  const addTask = usePlannerStore(
    (state) => state.addTask
  );

  const [title, setTitle] = useState("");
  const [description, setDescription] =
    useState("");
  const [priority, setPriority] =
    useState<TaskPriority>("MEDIUM");
  const [dueDate, setDueDate] =
    useState("");

  if (!open) return null;

  const handleSubmit = async () => {
    if (!title.trim() || !dueDate) {
      toast.error(
        "Please fill all required fields."
      );
      return;
    }

    await addTask({
      title,
      description,
      date: dueDate,
      priority,
    });

    toast.success(
      "Task added successfully."
    );

    setTitle("");
    setDescription("");
    setPriority("MEDIUM");
    setDueDate("");

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-xl rounded-3xl bg-white text-gray-700 shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 p-6">
          <h2 className="text-2xl font-bold text-gray-900">
            Add Planner Task
          </h2>

          <button
            onClick={onClose}
            className="rounded-lg p-1 text-gray-500 transition hover:bg-gray-100 hover:text-gray-700"
          >
            <X size={22} />
          </button>
        </div>

        {/* Body */}
        <div className="space-y-5 p-6">
          <input
            placeholder="Task title"
            value={title}
            onChange={(e) =>
              setTitle(e.target.value)
            }
            className="w-full rounded-xl border border-gray-300 p-3 text-gray-700 placeholder:text-gray-400 outline-none transition focus:border-rose-500 focus:ring-2 focus:ring-rose-200"
          />

          <textarea
            rows={4}
            placeholder="Description"
            value={description}
            onChange={(e) =>
              setDescription(
                e.target.value
              )
            }
            className="w-full rounded-xl border border-gray-300 p-3 text-gray-700 placeholder:text-gray-400 outline-none transition focus:border-rose-500 focus:ring-2 focus:ring-rose-200"
          />

          <div className="grid gap-4 md:grid-cols-2">
            <select
              value={priority}
              onChange={(e) =>
                setPriority(
                  e.target
                    .value as TaskPriority
                )
              }
              className="rounded-xl border border-gray-300 p-3 text-gray-700 outline-none transition focus:border-rose-500 focus:ring-2 focus:ring-rose-200"
            >
              <option value="LOW">
                Low
              </option>

              <option value="MEDIUM">
                Medium
              </option>

              <option value="HIGH">
                High
              </option>
            </select>

            <input
              type="date"
              value={dueDate}
              onChange={(e) =>
                setDueDate(
                  e.target.value
                )
              }
              className="rounded-xl border border-gray-300 p-3 text-gray-700 outline-none transition focus:border-rose-500 focus:ring-2 focus:ring-rose-200"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 border-t border-gray-100 p-6">
          <button
            onClick={onClose}
            className="rounded-xl border border-gray-300 px-6 py-3 font-medium text-gray-600 transition hover:bg-gray-100"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            className="rounded-xl bg-rose-500 px-6 py-3 font-semibold text-white transition hover:bg-rose-600"
          >
            Add Task
          </button>
        </div>
      </div>
    </div>
  );
}