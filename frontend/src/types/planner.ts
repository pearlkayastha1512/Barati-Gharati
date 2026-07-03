export type TaskStatus =
  | "pending"
  | "completed";

export type TaskPriority =
  | "low"
  | "medium"
  | "high";

export interface PlannerTask {
  id: string;

  customerId: string;

  title: string;

  description: string;

  dueDate: string;

  priority: TaskPriority;

  status: TaskStatus;

  createdAt: string;

  updatedAt: string;
}