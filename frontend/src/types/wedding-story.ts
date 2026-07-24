export interface WeddingStoryImage {
  id?: string;
  image: string;
  sortOrder: number;
}

export interface WeddingStoryTimeline {
  id?: string;
  title: string;
  description: string;
  sortOrder: number;
}

export interface WeddingStory {
  id: string;

  title: string;
  slug: string;

  location: string;
  coverImage: string;

  story: string[];

  guests: number;
  vendors: number;
  celebrationDays: number;

  budget: string;

  venue: string;
  photographer: string;
  decor: string;

  featured: boolean;
  published: boolean;

  galleryImages: WeddingStoryImage[];
  timeline: WeddingStoryTimeline[];

  createdBy?: {
    id: string;
    name: string;
    email: string;
  };

  createdAt: string;
  updatedAt: string;
}

export interface CreateWeddingStoryDto {
  title: string;
  slug: string;

  location: string;
  coverImage: string;

  story: string[];

  guests: number;
  vendors: number;
  celebrationDays: number;

  budget: string;

  venue: string;
  photographer: string;
  decor: string;

  featured: boolean;
  published: boolean;

  galleryImages: WeddingStoryImage[];
  timeline: WeddingStoryTimeline[];
}

export interface UpdateWeddingStoryDto
  extends Partial<CreateWeddingStoryDto> {}

export interface WeddingStoryResponse {
  success: boolean;
  message?: string;
  data: WeddingStory;
}

export interface WeddingStoriesResponse {
  success: boolean;
  data: WeddingStory[];
}