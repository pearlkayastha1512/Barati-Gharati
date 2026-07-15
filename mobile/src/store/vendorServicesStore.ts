import { create } from "zustand";

import {
  getMyServices,
  createService,
  updateServiceApi,
  deleteServiceApi,
  BackendService,
  uploadServiceImage,
} from "../api/vendorServices.api";
import { AxiosError } from "axios";

export type ServiceCategory =
  | "Venue"
  | "Photographer"
  | "Videographer"
  | "Decorator"
  | "Makeup Artist"
  | "Mehendi Artist"
  | "Caterer"
  | "Cake Designer"
  | "DJ"
  | "Live Band"
  | "Entertainment"
  | "Wedding Planner"
  | "Transportation"
  | "Accommodation"
  | "Invitation Designer"
  | "Bridal Wear"
  | "Groom Wear"
  | "Jewellery"
  | "Florist"
  | "Pandit / Priest"
  | "Event Planner"
  | "Birthday Planner"
  | "Kids Party Planner"
  | "Balloon Decorator"
  | "Theme Decorator"
  | "Kids Entertainer"
  | "Magician"
  | "Anchor / Emcee"
  | "Choreographer"
  | "Party Supplies"
  | "Return Gifts"
  | "Gift Hampers"
  | "Sound and Lighting"
  | "Photo Booth"
  | "Event Security"
  | "Other";

export const SERVICE_CATEGORIES: ServiceCategory[] = [
  "Venue",
  "Photographer",
  "Videographer",
  "Decorator",
  "Makeup Artist",
  "Mehendi Artist",
  "Caterer",
  "Cake Designer",
  "DJ",
  "Live Band",
  "Entertainment",
  "Wedding Planner",
  "Transportation",
  "Accommodation",
  "Invitation Designer",
  "Bridal Wear",
  "Groom Wear",
  "Jewellery",
  "Florist",
  "Pandit / Priest",
  "Event Planner",
  "Birthday Planner",
  "Kids Party Planner",
  "Balloon Decorator",
  "Theme Decorator",
  "Kids Entertainer",
  "Magician",
  "Anchor / Emcee",
  "Choreographer",
  "Party Supplies",
  "Return Gifts",
  "Gift Hampers",
  "Sound and Lighting",
  "Photo Booth",
  "Event Security",
  "Other",
];

export interface VendorServiceRecord {
  id: string;
  serviceName: string;
  category: ServiceCategory;
  description: string;
  duration: string;
  price: number;
  image: string | null;
  status: "Active" | "Inactive";
  rating: number;
  reviewsCount: number;
}

interface VendorServicesState {
  services: VendorServiceRecord[];

  fetchServices: () => Promise<void>;

  addService: (
    service: Omit<
      VendorServiceRecord,
      "id" | "rating" | "reviewsCount" | "status"
    >
  ) => Promise<ServiceActionResult>;

  updateService: (
    id: string,
    updates: Partial<VendorServiceRecord>
  ) => Promise<ServiceActionResult>;

  deleteService: (id: string) => Promise<ServiceActionResult>;
}

export type ServiceActionResult = {
  success: boolean;
  error?: string;
};

const isLocalImage = (image?: string | null) =>
  !!image && /^(file|content):\/\//i.test(image);

const getErrorMessage = (error: unknown) => {
  if (error instanceof AxiosError) {
    const responseMessage = error.response?.data?.message;
    const message = Array.isArray(responseMessage)
      ? responseMessage.join(" ")
      : responseMessage;

    if (typeof message === "string" && message.trim()) {
      return message;
    }

    if (!error.response) {
      return "Backend server se connection nahi ho pa raha hai.";
    }
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return "Service save nahi ho saki.";
};

const resolveImage = async (image?: string | null) => {
  if (!image) return "";
  return isLocalImage(image) ? uploadServiceImage(image) : image;
};

const mapCategory = (category: string): ServiceCategory => {
  if (SERVICE_CATEGORIES.includes(category as ServiceCategory)) {
    return category as ServiceCategory;
  }

  return "Other";
};

const mapService = (
  service: BackendService
): VendorServiceRecord => ({
  id: service.id,

  serviceName: service.name,

  category: mapCategory(service.category),

  description: service.description ?? "",

  duration: service.duration ?? "",

  price: Number(service.price),

  image: service.image ?? null,

  rating: Number(service.rating ?? 0),

  reviewsCount: Number(service.reviews ?? 0),

  status: service.status === "active" ? "Active" : "Inactive",
});

export const useVendorServicesStore = create<VendorServicesState>(
  (set, get) => ({
    services: [],

    fetchServices: async () => {
      try {
        console.log("Fetching services...");

        const data = await getMyServices();

        console.log("Fetched Services:", data);

        set({
          services: data.map(mapService),
        });
      } catch (error) {
        console.log("FETCH SERVICES ERROR:", error);
      }
    },

    addService: async (service) => {
      try {
        const image = await resolveImage(service.image);

        await createService({
          name: service.serviceName,
          category: service.category,
          description: service.description,
          duration: service.duration,
          price: service.price,
          image,
          includes: [],
        });

        await get().fetchServices();
        return { success: true };
      } catch (error) {
        return { success: false, error: getErrorMessage(error) };
      }
    },

    updateService: async (id, updates) => {
      try {
        const image = await resolveImage(updates.image);

        await updateServiceApi(id, {
          name: updates.serviceName,
          category: updates.category,
          description: updates.description,
          duration: updates.duration,
          price: updates.price,
          image,
          includes: [],
        });

        await get().fetchServices();
        return { success: true };
      } catch (error) {
        return { success: false, error: getErrorMessage(error) };
      }
    },

    deleteService: async (id) => {
      try {
        await deleteServiceApi(id);

        await get().fetchServices();
        return { success: true };
      } catch (error) {
        return { success: false, error: getErrorMessage(error) };
      }
    },
  })
);
