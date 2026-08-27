import { create } from "zustand";

import { PlannerTask } from "@/types/planner";
import { plannerService } from "@/services/planner.service";

interface PlannerStore {
  tasks: PlannerTask[];
  isLoading: boolean;
  error: string | null;

  loadTasks: () => Promise<void>;

  addTask: (task: any) => Promise<void>;

  updateTask: (
    id: string,
    task: any
  ) => Promise<void>;

  deleteTask: (
    id: string
  ) => Promise<void>;

  toggleTask: (
    id: string,
    status: string
  ) => Promise<void>;
}

export const usePlannerStore =
  create<PlannerStore>((set) => ({
    tasks: [],
    isLoading: false,
    error: null,

    loadTasks: async () => {
      set({ isLoading: true, error: null });
      try {
        const result =
          await plannerService.getTasks();

        set({
          tasks: Array.isArray(result?.data)
            ? result.data
            : Array.isArray(result)
            ? result
            : [],
          isLoading: false,
        });
      } catch (err: any) {
        set({
          tasks: [],
          isLoading: false,
          error:
            err?.response?.data?.message ||
            err?.message ||
            "Failed to load tasks",
        });
      }
    },

    addTask: async (task) => {
      set({ error: null });
      try {
        await plannerService.addTask(task);

        const result =
          await plannerService.getTasks();

        set({
          tasks: Array.isArray(result?.data)
            ? result.data
            : Array.isArray(result)
            ? result
            : [],
        });
      } catch (err: any) {
        set({
          error:
            err?.response?.data?.message ||
            err?.message ||
            "Failed to add task",
        });
      }
    },

    updateTask: async (
      id,
      task
    ) => {
      set({ error: null });
      try {
        await plannerService.updateTask(
          id,
          task
        );

        const result =
          await plannerService.getTasks();

        set({
          tasks: Array.isArray(result?.data)
            ? result.data
            : Array.isArray(result)
            ? result
            : [],
        });
      } catch (err: any) {
        set({
          error:
            err?.response?.data?.message ||
            err?.message ||
            "Failed to update task",
        });
      }
    },

    deleteTask: async (id) => {
      set({ error: null });
      try {
        await plannerService.deleteTask(id);

        const result =
          await plannerService.getTasks();

        set({
          tasks: Array.isArray(result?.data)
            ? result.data
            : Array.isArray(result)
            ? result
            : [],
        });
      } catch (err: any) {
        set({
          error:
            err?.response?.data?.message ||
            err?.message ||
            "Failed to delete task",
        });
      }
    },

    toggleTask: async (
      id,
      status
    ) => {
      set({ error: null });
      try {
        await plannerService.toggleTask(
          id,
          status
        );

        const result =
          await plannerService.getTasks();

        set({
          tasks: Array.isArray(result?.data)
            ? result.data
            : Array.isArray(result)
            ? result
            : [],
        });
      } catch (err: any) {
        set({
          error:
            err?.response?.data?.message ||
            err?.message ||
            "Failed to toggle task",
        });
      }
    },
  }));