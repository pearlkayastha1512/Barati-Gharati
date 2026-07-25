import api from "./axios";
import {
  PremiumPlanningRequest,
  CreatePremiumPlanningRequestPayload,
  ApiEnvelope,
} from "../types/premiumPlanning";

export const premiumPlanningApi = {
  create: async (
    payload: CreatePremiumPlanningRequestPayload,
  ): Promise<PremiumPlanningRequest> => {
    const { data } = await api.post<ApiEnvelope<PremiumPlanningRequest>>(
      "/premium-planning/requests",
      payload,
    );
    return data.data;
  },

  listMine: async (): Promise<PremiumPlanningRequest[]> => {
    const { data } = await api.get<ApiEnvelope<PremiumPlanningRequest[]>>(
      "/premium-planning/requests/mine",
    );
    return data.data;
  },

  respond: async (
    id: string,
    accept: boolean,
  ): Promise<PremiumPlanningRequest> => {
    const { data } = await api.patch<ApiEnvelope<PremiumPlanningRequest>>(
      `/premium-planning/requests/${id}/respond`,
      { accept },
    );
    return data.data;
  },

  payAdvance: async (id: string): Promise<PremiumPlanningRequest> => {
    const { data } = await api.post<ApiEnvelope<PremiumPlanningRequest>>(
      `/premium-planning/requests/${id}/pay-advance`,
    );
    return data.data;
  },
};