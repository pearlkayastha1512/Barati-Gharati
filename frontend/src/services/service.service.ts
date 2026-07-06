import { Service } from "@/types/service";

import {
  getServicesApi,
  getVendorServicesApi,
  createServiceApi,
  updateServiceApi,
  deleteServiceApi,
} from "@/services/api/service.api";

export async function getServices(): Promise<Service[]> {
  const result = await getServicesApi();

  if (!result.ok || !result.data) {
    return [];
  }

  return result.data;
}

export async function getVendorServices(
  vendorId: number
): Promise<Service[]> {
  void vendorId;

  const result =
    await getVendorServicesApi();

  if (!result.ok || !result.data) {
    return [];
  }

  return result.data;
}

export async function createService(
  service: Service
): Promise<boolean> {
  const result = await createServiceApi(service);

  return result.ok;
}

export async function updateService(
  service: Service
): Promise<boolean> {
  const result = await updateServiceApi(service);

  return result.ok;
}

export async function deleteService(
  id: string
): Promise<boolean> {
  const result = await deleteServiceApi(id);

  return result.ok;
}

export async function getServiceById(
  id: string
): Promise<Service | undefined> {
  const services = await getServices();

  return services.find(
    (service) => service.id === id
  );
}

