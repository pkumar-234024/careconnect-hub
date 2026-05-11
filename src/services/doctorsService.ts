import { doctors as fallbackDoctors } from "@/data/doctors";
import type { Doctor } from "@/types";
import { apiRequest } from "./api/client";

export const doctorsService = {
  list: async (): Promise<Doctor[]> => {
    try {
      return await apiRequest<Doctor[]>("/doctors");
    } catch {
      return fallbackDoctors;
    }
  },
  getById: async (id: string): Promise<Doctor | undefined> => {
    const doctors = await doctorsService.list();
    return doctors.find((doctor) => doctor.userId === id);
  },
};
