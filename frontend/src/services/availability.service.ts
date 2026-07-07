import { Availability } from "@/types/availability";

import {
  blockAvailabilityApi,
  getMyAvailabilityApi,
  getVendorAvailabilityApi,
  unblockAvailabilityApi,
} from "@/services/api/availability.api";

export async function getAvailability(): Promise<Availability[]> {
  const result = await getMyAvailabilityApi();

  if (!result.ok || !result.data?.success) {
    return [];
  }

  return result.data.data;
}

export async function getVendorAvailability(
  vendorId: number
): Promise<Availability[]> {
  const result =
    await getVendorAvailabilityApi(vendorId);

  if (!result.ok || !result.data?.success) {
    return [];
  }

  return result.data.data;
}

export async function createAvailability({
  date,
  reason,
}: {
  date: string;
  reason?: string;
}): Promise<Availability | null> {
  const result = await blockAvailabilityApi({
    date,
    reason,
  });

  return result.ok && result.data ? result.data : null;
}

export async function deleteAvailability(
  id: string
): Promise<boolean> {
  const result = await unblockAvailabilityApi(id);

  return result.ok;
}
