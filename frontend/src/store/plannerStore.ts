import { create } from "zustand";

import { PlannerTask } from "@/types/planner";
import { plannerService } from "@/services/planner.service";

interface PlannerStore {
  tasks: PlannerTask[];

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

    loadTasks: async () => {
      const result =
        await plannerService.getTasks();

      set({
        tasks: result.data,
      });
    },

    addTask: async (task) => {
      await plannerService.addTask(task);

      const result =
        await plannerService.getTasks();

      set({
        tasks: result.data,
      });
    },

    updateTask: async (
      id,
      task
    ) => {
      await plannerService.updateTask(
        id,
        task
      );

      const result =
        await plannerService.getTasks();

      set({
        tasks: result.data,
      });
    },

    deleteTask: async (id) => {
      await plannerService.deleteTask(id);

      const result =
        await plannerService.getTasks();

      set({
        tasks: result.data,
      });
    },

    toggleTask: async (
      id,
      status
    ) => {
      await plannerService.toggleTask(
        id,
        status
      );

      const result =
        await plannerService.getTasks();

      set({
        tasks: result.data,
      });
    },
  }));