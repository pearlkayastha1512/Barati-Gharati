import { create } from "zustand";

import { Service } from "@/types/service";
import { getVendorByUserId } from "@/services/vendor.service";

import {
  getServices,
  createService,
  updateService,
  deleteService,
  getVendorServices,
  getMyServices,
} from "@/services/service.service";

interface ServiceStore {
  services: Service[];

  selectedService: Service | null;

  loadServices: () => Promise<void>;

  loadVendorServices: (
    vendorId: number
  ) => Promise<void>;

  loadMyServices: () => Promise<void>;

  setSelectedService: (
    service: Service | null
  ) => void;

  addService: (
    service: Service
  ) => Promise<boolean>;

  updateExistingService: (
    service: Service
  ) => Promise<boolean>;

  deleteExistingService: (
    id: string
  ) => Promise<boolean>;
}

export const useServiceStore =
  create<ServiceStore>((set) => ({
    services: [],

    selectedService: null,

    loadServices: async () => {
      const services =
        await getServices();

      set({
        services,
      });
    },

    loadVendorServices:
      async (vendorId) => {
        const services =
          await getVendorServices(
            vendorId
          );

        set({
          services,
        });
      },

    loadMyServices: async () => {
      const services =
        await getMyServices();

      set({
        services,
      });
    },

    setSelectedService: (
      service
    ) => {
      set({
        selectedService: service,
      });
    },

    addService: async (
      service
    ) => {
      const success =
        await createService(service);

      if (!success) {
        // A request can time out after the database commit. Reload once before
        // showing an error so the vendor is not encouraged to create a duplicate.
        const services = await getMyServices();
        const justCreated = services.some((item) => {
          const createdAt = new Date(item.createdAt).getTime();
          const createdRecently =
            Number.isFinite(createdAt) &&
            Date.now() - createdAt < 2 * 60 * 1000;

          return (
            createdRecently &&
            item.name.trim().toLowerCase() ===
              service.name.trim().toLowerCase() &&
            item.category.trim().toLowerCase() ===
              service.category.trim().toLowerCase() &&
            Number(item.price) === Number(service.price)
          );
        });

        if (justCreated) {
          set({ services });
          return true;
        }

        return false;
      }

      // const services =
      //   await getVendorServices(
      //     service.vendorId
      //   );






      // set({
      //   services,
      // });


      const services =
        await getMyServices();

      set({
        services,
      });
      return true;
    },

    updateExistingService:
      async (service) => {
        const success =
          await updateService(
            service
          );

        if (!success) {
          return false;
        }

        const services =
          await getMyServices();

        set({
          services,
        });

        return true;
      },

    deleteExistingService:
      async (id) => {
        const success =
          await deleteService(id);

        if (!success) {
          return false;
        }

        const services =
          await getMyServices();

        set({
          services,
        });

        return true;
      },
  }));
