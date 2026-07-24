import { create } from "zustand";
import { toast } from "sonner";

import {
  WeddingStory,
  CreateWeddingStoryDto,
  UpdateWeddingStoryDto,
} from "@/types/wedding-story";

import {
  getWeddingStoriesApi,
  getWeddingStoryApi,
  getHomeWeddingStoriesApi,
  getWeddingStoryBySlugApi,
  createWeddingStoryApi,
  updateWeddingStoryApi,
  deleteWeddingStoryApi,
  toggleFeaturedApi,
  togglePublishedApi,
} from "@/services/api/wedding-story.api";

interface WeddingStoryStore {
  stories: WeddingStory[];
  homeStories: WeddingStory[];

  selectedStory: WeddingStory | null;

  loading: boolean;

  fetchStories: () => Promise<void>;

  fetchHomeStories: () => Promise<void>;

  fetchStory: (
    id: string
  ) => Promise<WeddingStory | null>;

  fetchStoryBySlug: (
    slug: string
  ) => Promise<WeddingStory | null>;

  createStory: (
    payload: CreateWeddingStoryDto
  ) => Promise<boolean>;

  updateStory: (
    id: string,
    payload: UpdateWeddingStoryDto
  ) => Promise<boolean>;

  deleteStory: (
    id: string
  ) => Promise<boolean>;

  toggleFeatured: (
    id: string
  ) => Promise<void>;

  togglePublished: (
    id: string
  ) => Promise<void>;

  clearSelectedStory: () => void;
}

export const useWeddingStoryStore =
  create<WeddingStoryStore>((set, get) => ({
    stories: [],

    homeStories: [],

    selectedStory: null,

    loading: false,

    fetchStories: async () => {
      set({ loading: true });

      const res = await getWeddingStoriesApi();

      if (res.ok && res.data) {
        set({
          stories: res.data,
          loading: false,
        });

        return;
      }

      toast.error(
        res.error ??
          "Unable to load wedding stories."
      );

      set({
        loading: false,
      });
    },

    fetchHomeStories: async () => {
      set({ loading: true });

      const res =
        await getHomeWeddingStoriesApi();

      if (res.ok && res.data) {
        set({
          homeStories: res.data,
          loading: false,
        });

        return;
      }

      toast.error(
        res.error ??
          "Unable to load wedding stories."
      );

      set({
        loading: false,
      });
    },

    fetchStory: async (id) => {
      set({ loading: true });

      const res =
        await getWeddingStoryApi(id);

      if (res.ok && res.data) {
        set({
          selectedStory: res.data,
          loading: false,
        });

        return res.data;
      }

      toast.error(
        res.error ??
          "Unable to load story."
      );

      set({
        loading: false,
      });

      return null;
    },

    fetchStoryBySlug: async (slug) => {
      set({ loading: true });

      const res =
        await getWeddingStoryBySlugApi(slug);

      if (res.ok && res.data) {
        set({
          selectedStory: res.data,
          loading: false,
        });

        return res.data;
      }

      toast.error(
        res.error ??
          "Unable to load story."
      );

      set({
        loading: false,
      });

      return null;
    },

    createStory: async (payload) => {
      set({ loading: true });

      const res =
        await createWeddingStoryApi(payload);

      set({ loading: false });

      if (!res.ok) {
        toast.error(
          res.error ??
            "Unable to create story."
        );

        return false;
      }

      toast.success(
        "Wedding story created."
      );

      await get().fetchStories();

      return true;
    },

    updateStory: async (
      id,
      payload
    ) => {
      set({ loading: true });

      const res =
        await updateWeddingStoryApi(
          id,
          payload
        );

      set({ loading: false });

      if (!res.ok) {
        toast.error(
          res.error ??
            "Unable to update story."
        );

        return false;
      }

      toast.success(
        "Wedding story updated."
      );

      await get().fetchStories();

      return true;
    },

    deleteStory: async (id) => {
      set({ loading: true });

      const res =
        await deleteWeddingStoryApi(id);

      set({ loading: false });

      if (!res.ok) {
        toast.error(
          res.error ??
            "Unable to delete story."
        );

        return false;
      }

      toast.success(
        "Wedding story deleted."
      );

      await get().fetchStories();

      return true;
    },

    toggleFeatured: async (id) => {
      const res =
        await toggleFeaturedApi(id);

      if (!res.ok) {
        toast.error(
          res.error ??
            "Unable to update featured status."
        );

        return;
      }

      await get().fetchStories();
      await get().fetchHomeStories();
    },

    togglePublished: async (id) => {
      const res =
        await togglePublishedApi(id);

      if (!res.ok) {
        toast.error(
          res.error ??
            "Unable to update publish status."
        );

        return;
      }

      await get().fetchStories();
      await get().fetchHomeStories();
    },

    clearSelectedStory: () =>
      set({
        selectedStory: null,
      }),
  }));