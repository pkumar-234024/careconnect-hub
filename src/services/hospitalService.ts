import type { Hospital } from "@/types";
import { hospitals as fallbackHospitals } from "@/data/hospitals";
import { apiRequest } from "./api/client";

export const hospitalService = {
  list: async (): Promise<Hospital[]> => {
    try {
      return await apiRequest<Hospital[]>("/hospitals");
    } catch {
      return fallbackHospitals;
    }
  },
};
