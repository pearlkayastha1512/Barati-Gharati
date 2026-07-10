import { create } from "zustand";

import {
  getMyServices,
  createService,
  updateServiceApi,
  deleteServiceApi,
  BackendService,
} from "../api/vendorServices.api";

export type ServiceCategory =
  | "Photographer"
  | "Caterer"
  | "Decorator"
  | "Venue"
  | "Makeup Artist"
  | "DJ / Music"
  | "Other";

export const SERVICE_CATEGORIES: ServiceCategory[] = [
  "Photographer",
  "Caterer",
  "Decorator",
  "Venue",
  "Makeup Artist",
  "DJ / Music",
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
  ) => Promise<void>;

  updateService: (
    id: string,
    updates: Partial<VendorServiceRecord>
  ) => Promise<void>;

  deleteService: (id: string) => Promise<void>;
}

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
        await createService({
          name: service.serviceName,
          category: service.category,
          description: service.description,
          duration: service.duration,
          price: service.price,
          image: service.image ?? "",
          includes: [],
        });

        await get().fetchServices();
      } catch (error) {
        console.log("CREATE SERVICE ERROR:", error);
      }
    },

    updateService: async (id, updates) => {
      try {
        await updateServiceApi(id, {
          name: updates.serviceName,
          category: updates.category,
          description: updates.description,
          duration: updates.duration,
          price: updates.price,
          image: updates.image ?? "",
          includes: [],
        });

        await get().fetchServices();
      } catch (error) {
        console.log("UPDATE SERVICE ERROR:", error);
      }
    },

    deleteService: async (id) => {
      try {
        await deleteServiceApi(id);

        await get().fetchServices();
      } catch (error) {
        console.log("DELETE SERVICE ERROR:", error);
      }
    },
  })
);