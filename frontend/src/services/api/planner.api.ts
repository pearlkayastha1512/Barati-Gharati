import api from "@/lib/axios";

export async function getTasksApi() {
  const { data } = await api.get("/timeline");
  return data;
}

export async function createTaskApi(task: any) {
  const { data } = await api.post("/timeline", task);
  return data;
}

export async function updateTaskApi(
  id: string,
  task: any
) {
  const { data } = await api.patch(
    `/timeline/${id}`,
    task
  );

  return data;
}

export async function updateTaskStatusApi(
  id: string,
  status: string
) {
  const { data } = await api.patch(
    `/timeline/${id}/status`,
    {
      status,
    }
  );

  return data;
}

export async function deleteTaskApi(
  id: string
) {
  const { data } = await api.delete(
    `/timeline/${id}`
  );

  return data;
}