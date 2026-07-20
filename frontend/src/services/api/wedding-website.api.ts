import api from "@/lib/axios";

export type WeddingEvent = {
  id: string;

  title: string;

  description: string | null;

  date: string | null;

  time: string | null;

  venue: string | null;
};

export type WeddingGallery = {
  id: string;

  imageUrl: string;

  caption: string | null;
};

export type WeddingWebsite = {
  id: string;
userId: string;
  bookingId: string | null;

  slug: string;

  brideName: string;

  groomName: string;

  weddingDate: string | null;

  heroImage: string | null;

  coverImage: string | null;

  story: string | null;

  venueName: string | null;

  venueAddress: string | null;

  template: string;

  galleryImages: string[];

  isPublished: boolean;

  createdAt: string;

  updatedAt: string;

  events: WeddingEvent[];

  galleries: WeddingGallery[];
};

type WeddingWebsiteResponse = {
  success: boolean;

  message?: string;

  data: WeddingWebsite;
};

export const createWeddingWebsite =
  async (): Promise<WeddingWebsite> => {
    const response =
      await api.post<WeddingWebsiteResponse>(
        "/wedding-websites",
      );

    return response.data.data;
  };

export const getMyWeddingWebsite =
  async (): Promise<WeddingWebsite> => {
    const response =
      await api.get<WeddingWebsiteResponse>(
        "/wedding-websites/me",
      );

    return response.data.data;
  };

export const getWeddingWebsiteBySlug =
  async (
    slug: string,
  ): Promise<WeddingWebsite> => {
    const response =
      await api.get<WeddingWebsiteResponse>(
        `/wedding-websites/${slug}`,
      );

    return response.data.data;
  };

export const toggleWeddingWebsite =
  async (): Promise<WeddingWebsite> => {
    const response =
      await api.patch<WeddingWebsiteResponse>(
        "/wedding-websites/publish/toggle",
      );

    return response.data.data;
  };

export const updateWeddingWebsite =
  async (data: {
    story?: string;
    heroImage?: string;
    coverImage?: string;
    template?: string;
    galleryImages?: string[];
    venueName?: string;
    venueAddress?: string;
  }): Promise<WeddingWebsite> => {
    const response =
      await api.patch<WeddingWebsiteResponse>(
        "/wedding-websites",
        data,
      );

    return response.data.data;
  };