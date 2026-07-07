import {
  getTasksApi,
  createTaskApi,
  updateTaskApi,
  updateTaskStatusApi,
  deleteTaskApi,
} from "@/services/api/planner.api";

class PlannerService {
  async getTasks() {
    return await getTasksApi();
  }

  async addTask(task: any) {
    return await createTaskApi(task);
  }

  async updateTask(
    id: string,
    task: any
  ) {
    return await updateTaskApi(id, task);
  }

  async toggleTask(
    id: string,
    status: string
  ) {
    return await updateTaskStatusApi(
      id,
      status
    );
  }

  async deleteTask(id: string) {
    return await deleteTaskApi(id);
  }
}

export const plannerService =
  new PlannerService();