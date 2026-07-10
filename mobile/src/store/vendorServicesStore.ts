import { create } from "zustand";

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
  addService: (service: Omit<VendorServiceRecord, "id" | "rating" | "reviewsCount" | "status">) => void;
  updateService: (id: string, updates: Partial<VendorServiceRecord>) => void;
  deleteService: (id: string) => void;
}

export const useVendorServicesStore = create<VendorServicesState>((set) => ({
  // ==============================
  // TODO: Fetch vendor's services from API on app load / screen mount
  // instead of starting empty here. Something like:
  //
  // const response = await getVendorServices(vendorId);
  // set({ services: response.data });
  //
  // For now, starts empty — vendor sees "No services found" until
  // they create one via the Add Service form.
  // ==============================
  services: [],

  addService: (service) => {
    // ==============================
    // TODO: Call Create Service API here instead of mutating local state.
    //
    // const response = await createVendorService(service);
    // set((state) => ({ services: [...state.services, response.data] }));
    //
    // Keep the local-state fallback below until the API is wired in.
    // ==============================
    set((state) => ({
      services: [
        ...state.services,
        {
          ...service,
          id: Date.now().toString(),
          status: "Active",
          rating: 0,
          reviewsCount: 0,
        },
      ],
    }));
  },

  updateService: (id, updates) => {
    // ==============================
    // TODO: Call Update Service API here instead of mutating local state.
    //
    // const response = await updateVendorService(id, updates);
    // set((state) => ({
    //   services: state.services.map((s) => (s.id === id ? response.data : s)),
    // }));
    // ==============================
    set((state) => ({
      services: state.services.map((s) => (s.id === id ? { ...s, ...updates } : s)),
    }));
  },

  deleteService: (id) => {
    // ==============================
    // TODO: Call Delete Service API here instead of mutating local state.
    //
    // await deleteVendorService(id);
    // set((state) => ({ services: state.services.filter((s) => s.id !== id) }));
    // ==============================
    set((state) => ({
      services: state.services.filter((s) => s.id !== id),
    }));
  },
}));