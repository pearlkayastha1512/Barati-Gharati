const STORAGE_KEY = "planner_tasks";


import {
  PlannerTask,
  TaskStatus,
} from "@/types/planner";

class PlannerService {
  getTasks(): PlannerTask[] {
    if (typeof window === "undefined") {
      return [];
    }

    const data = localStorage.getItem(STORAGE_KEY);

    return data ? JSON.parse(data) : [];
  }

  saveTasks(tasks: PlannerTask[]) {
    if (typeof window === "undefined") {
      return;
    }

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(tasks)
    );
  }

  addTask(task: PlannerTask) {
    const tasks = this.getTasks();

    tasks.push(task);

    this.saveTasks(tasks);
  }

  updateTask(task: PlannerTask) {
    const tasks = this.getTasks().map((item) =>
      item.id === task.id ? task : item
    );

    this.saveTasks(tasks);
  }

  deleteTask(id: string) {
    const tasks = this.getTasks().filter(
      (item) => item.id !== id
    );

    this.saveTasks(tasks);
  }

 toggleTask(id: string) {
  const tasks: PlannerTask[] = this.getTasks().map((item) => {
    if (item.id !== id) return item;

    return {
      ...item,
      status:
        item.status === "completed"
          ? "pending"
          : "completed",
    };
  });

  this.saveTasks(tasks);
}

  clearTasks() {
    if (typeof window === "undefined") {
      return;
    }

    localStorage.removeItem(STORAGE_KEY);
  }
}

export const plannerService =
  new PlannerService();