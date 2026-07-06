import { create } from "zustand";

import { Service } from "@/types/service";
import { getVendorByUserId } from "@/services/vendor.service";

import {
  getServices,
  createService,
  updateService,
  deleteService,
  getVendorServices,
} from "@/services/service.service";

interface ServiceStore {
  services: Service[];

  selectedService: Service | null;

  loadServices: () => Promise<void>;

  loadVendorServices: (
    vendorId: number
  ) => Promise<void>;

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
        return false;
      }

      // const services =
      //   await getVendorServices(
      //     service.vendorId
      //   );






      // set({
      //   services,
      // });


        const vendor =
  await getVendorByUserId();

if (!vendor) {
  return true;
}

const services =
  await getVendorServices(
    vendor.id
  );

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
          await getVendorServices(
            service.vendorId
          );

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
          await getServices();

        set({
          services,
        });

        return true;
      },
  }));


