import api from "@/lib/axios";

export type PremiumPlanningStatus =
  | "SUBMITTED"
  | "UNDER_REVIEW"
  | "VENDORS_ASSIGNED"
  | "QUOTED"
  | "ACCEPTED"
  | "REJECTED"
  | "BOOKED";

export type PremiumPlanningRequest = {
  id: string;
  weddingType: string;
  venuePreference: string;
  budget: string | number;
  city: string;
  guestCount: number;
  theme: string;
  requiredVendors: string[];
  specialRequirements?: string;
  status: PremiumPlanningStatus;
  assignedVendorIds: string[];
  assignedVendors?: Array<{
    id: string;
    profileId?: number | null;
    businessName: string;
    category: string;
    city: string;
    logoUrl?: string | null;
    coverImage?: string | null;
  }>;
  quotationAmount?: string | number;
  quotationDetails?: Record<string, unknown>;
  adminNotes?: string;
  createdAt: string;
  user?: { id: string; name: string; email: string; phone?: string };
};

export type CreatePremiumPlanningRequest = {
  weddingType: string;
  venuePreference: string;
  budget: number;
  city: string;
  guestCount: number;
  theme: string;
  requiredVendors: string[];
  specialRequirements?: string;
};

export async function getMyPremiumPlanningRequestsApi() {
  const { data } = await api.get("/premium-planning/requests/mine");
  return data.data as PremiumPlanningRequest[];
}

export async function createPremiumPlanningRequestApi(payload: CreatePremiumPlanningRequest) {
  const { data } = await api.post("/premium-planning/requests", payload);
  return data.data as PremiumPlanningRequest;
}

export async function respondToPremiumQuotationApi(id: string, accept: boolean) {
  const { data } = await api.patch(`/premium-planning/requests/${id}/respond`, { accept });
  return data.data as PremiumPlanningRequest;
}

export async function getAdminPremiumPlanningRequestsApi() {
  const { data } = await api.get("/premium-planning/admin/requests");
  return data.data as PremiumPlanningRequest[];
}

export type PremiumPlanningVendorOption = {
  id: string;
  businessName: string;
  ownerName: string;
  category: string;
  city: string;
  approvalStatus: "approved";
};

export async function getPremiumPlanningApprovedVendorsApi() {
  const { data } = await api.get("/premium-planning/admin/vendors");
  return data.data as PremiumPlanningVendorOption[];
}

export async function reviewPremiumPlanningRequestApi(
  id: string,
  payload: { assignedVendorIds?: string[]; adminNotes?: string }
) {
  const { data } = await api.patch(`/premium-planning/admin/requests/${id}/review`, payload);
  return data.data as PremiumPlanningRequest;
}

export async function quotePremiumPlanningRequestApi(
  id: string,
  payload: { amount: number; details?: Record<string, unknown>; adminNotes?: string }
) {
  const { data } = await api.patch(`/premium-planning/admin/requests/${id}/quotation`, payload);
  return data.data as PremiumPlanningRequest;
}

export async function bookPremiumPlanningRequestApi(id: string) {
  const { data } = await api.patch(`/premium-planning/admin/requests/${id}/book`);
  return data.data as PremiumPlanningRequest;
}
