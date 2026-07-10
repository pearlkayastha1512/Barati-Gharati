"use client";

import { useEffect, useState } from "react";

import { X } from "lucide-react";
import { toast } from "sonner";

import { TaskPriority, PlannerTask } from "@/types/planner";
import { usePlannerStore } from "@/store/plannerStore";

interface Props {
  open: boolean;
  task: PlannerTask | null;
  onClose: () => void;
}

export default function EditTaskModal({
  open,
  task,
  onClose,
}: Props) {
  const updateTask = usePlannerStore(
    (state) => state.updateTask
  );

  const [title, setTitle] = useState("");
  const [description, setDescription] =
    useState("");

  const [priority, setPriority] =
    useState<TaskPriority>("MEDIUM");

  const [date, setDate] = useState("");

  useEffect(() => {
    if (!task) return;

    setTitle(task.title);

    setDescription(task.description ?? "");

    setPriority(task.priority);

    setDate(task.date.split("T")[0]);
  }, [task]);

  if (!open || !task) return null;

  const handleSave = async () => {
    if (!title.trim() || !date) {
      toast.error(
        "Please fill all required fields."
      );

      return;
    }

    await updateTask(task.id, {
      title,
      description,
      date,
      priority,
    });

    toast.success(
      "Task updated successfully."
    );

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-xl rounded-3xl bg-white text-[#6c2d45] shadow-xl">

        {/* Header */}

        <div className="flex items-center justify-between border-b border-[#fff3b0] p-6">

          <h2 className="text-2xl font-bold text-[#6c2d45]">
            Edit Planner Task
          </h2>

          <button
            onClick={onClose}
            className="rounded-lg p-1 text-[#8d6171] transition hover:bg-[#fff8d8] hover:text-[#6c2d45]"
          >
            <X size={22} />
          </button>

        </div>

        {/* Body */}

        <div className="space-y-5 p-6">

          <input
            value={title}
            onChange={(e) =>
              setTitle(e.target.value)
            }
            className="w-full rounded-xl border border-[#ffb3bf] p-3 text-[#6c2d45] outline-none focus:border-[#ff4d6d]"
          />

          <textarea
            rows={4}
            value={description}
            onChange={(e) =>
              setDescription(
                e.target.value
              )
            }
            className="w-full rounded-xl border border-[#ffb3bf] p-3 text-[#6c2d45] outline-none focus:border-[#ff4d6d]"
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
              className="rounded-xl border border-[#ffb3bf] p-3 text-[#6c2d45] outline-none focus:border-[#ff4d6d]"
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
              value={date}
              onChange={(e) =>
                setDate(
                  e.target.value
                )
              }
              className="rounded-xl border border-[#ffb3bf] p-3 text-[#6c2d45] outline-none focus:border-[#ff4d6d]"
            />

          </div>

        </div>

        {/* Footer */}

        <div className="flex justify-end gap-3 border-t border-[#fff3b0] p-6">

          <button
            onClick={onClose}
            className="rounded-xl border border-[#ffb3bf] px-6 py-3 font-medium text-[#7a4a5c] hover:bg-[#fff8d8]"
          >
            Cancel
          </button>

          <button
            onClick={handleSave}
            className="rounded-xl bg-[#ff4d6d] px-6 py-3 font-semibold text-white hover:bg-[#e63b5f]"
          >
            Save Changes
          </button>

        </div>

      </div>
    </div>
  );
}