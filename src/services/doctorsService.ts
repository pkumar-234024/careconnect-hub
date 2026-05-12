import { doctors as fallbackDoctors } from "@/data/doctors";
import type { Doctor } from "@/types";
import { apiRequest } from "./api/client";

export const doctorsService = {
  list: async (hospitalId?: string): Promise<Doctor[]> => {
    try {
      const params = new URLSearchParams();
      if (hospitalId) {
        params.set("hospitalId", hospitalId);
      }
      const path = params.toString() ? `/doctors?${params.toString()}` : "/doctors";
      return await apiRequest<Doctor[]>(path);
    } catch {
      return hospitalId
        ? fallbackDoctors.filter((doctor) => doctor.hospitalId === hospitalId)
        : fallbackDoctors;
    }
  },
  getById: async (id: string): Promise<Doctor | undefined> => {
    const doctors = await doctorsService.list();
    return doctors.find((doctor) => doctor.userId === id);
  },
};
