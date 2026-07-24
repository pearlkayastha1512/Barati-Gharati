import {
  CreateWeddingStoryDto,
  UpdateWeddingStoryDto,
  WeddingStory,
} from "@/types/wedding-story";

import {
  createWeddingStoryApi,
  deleteWeddingStoryApi,
  getWeddingStoriesApi,
  getWeddingStoryApi,
  toggleFeaturedApi,
  togglePublishedApi,
  updateWeddingStoryApi,
} from "@/services/api/wedding-story.api";

export async function getWeddingStories(): Promise<WeddingStory[]> {
  const response = await getWeddingStoriesApi();

  if (!response.ok || !response.data) {
    throw new Error(
      response.error ?? "Unable to fetch wedding stories."
    );
  }

  return response.data;
}

export async function getWeddingStory(
  id: string
): Promise<WeddingStory> {
  const response = await getWeddingStoryApi(id);

  if (!response.ok || !response.data) {
    throw new Error(
      response.error ?? "Unable to fetch wedding story."
    );
  }

  return response.data;
}

export async function createWeddingStory(
  payload: CreateWeddingStoryDto
): Promise<WeddingStory> {
  const response =
    await createWeddingStoryApi(payload);

  if (!response.ok || !response.data) {
    throw new Error(
      response.error ?? "Unable to create wedding story."
    );
  }

  return response.data;
}

export async function updateWeddingStory(
  id: string,
  payload: UpdateWeddingStoryDto
): Promise<WeddingStory> {
  const response =
    await updateWeddingStoryApi(id, payload);

  if (!response.ok || !response.data) {
    throw new Error(
      response.error ?? "Unable to update wedding story."
    );
  }

  return response.data;
}

export async function deleteWeddingStory(
  id: string
): Promise<void> {
  const response =
    await deleteWeddingStoryApi(id);

  if (!response.ok) {
    throw new Error(
      response.error ?? "Unable to delete wedding story."
    );
  }
}

export async function toggleFeaturedStory(
  id: string
): Promise<WeddingStory> {
  const response =
    await toggleFeaturedApi(id);

  if (!response.ok || !response.data) {
    throw new Error(
      response.error ??
        "Unable to update featured status."
    );
  }

  return response.data;
}

export async function togglePublishedStory(
  id: string
): Promise<WeddingStory> {
  const response =
    await togglePublishedApi(id);

  if (!response.ok || !response.data) {
    throw new Error(
      response.error ??
        "Unable to update publish status."
    );
  }

  return response.data;
}