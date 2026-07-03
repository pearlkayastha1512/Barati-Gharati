import { create } from "zustand";

import { PlannerTask } from "@/types/planner";

import { plannerService } from "@/services/planner.service";


interface PlannerStore {
  tasks: PlannerTask[];

  loadTasks: () => void;

  addTask: (
    task: PlannerTask
  ) => void;

  updateTask: (
    task: PlannerTask
  ) => void;

  deleteTask: (
    id: string
  ) => void;

  toggleTask: (
    id: string
  ) => void;

  clearTasks: () => void;
}

export const usePlannerStore =
  create<PlannerStore>((set) => ({
    tasks: [],

    loadTasks: () => {
      set({
        tasks:
          plannerService.getTasks(),
      });
    },

    addTask: (task) => {
      plannerService.addTask(task);

      set({
        tasks:
          plannerService.getTasks(),
      });
    },

    updateTask: (task) => {
      plannerService.updateTask(task);

      set({
        tasks:
          plannerService.getTasks(),
      });
    },


    
    deleteTask: (id) => {
      plannerService.deleteTask(id);

      set({
        tasks:
          plannerService.getTasks(),
      });
    },

    toggleTask: (id) => {
      plannerService.toggleTask(id);

      set({
        tasks:
          plannerService.getTasks(),
      });
    },

    clearTasks: () => {
      plannerService.clearTasks();

      set({
        tasks: [],
      });
    },
  }));