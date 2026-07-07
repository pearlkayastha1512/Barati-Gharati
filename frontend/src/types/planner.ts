export type TaskStatus =
  | "PENDING"
  | "COMPLETED";

export type TaskPriority =
  | "LOW"
  | "MEDIUM"
  | "HIGH";

export interface PlannerTask {
  id: string;

  userId: string;

  title: string;

  description?: string;

  date: string;

  priority: TaskPriority;

  status: TaskStatus;

  createdAt: string;

  updatedAt: string;
}