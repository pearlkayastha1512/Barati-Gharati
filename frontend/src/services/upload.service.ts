import api from "@/lib/axios";

export async function uploadImage(
  file: File,
  folder = "wedding-planner"
): Promise<string> {
  const formData = new FormData();

  formData.append("file", file);

  const response = await api.post(
    `/upload/image?folder=${encodeURIComponent(folder)}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data.url;
}