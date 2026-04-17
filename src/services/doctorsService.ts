import { doctors } from "@/data/doctors";
import type { Doctor } from "@/types";
import { mockFetch } from "./api/client";

export const doctorsService = {
  list: (): Promise<Doctor[]> => mockFetch(doctors),
  getById: (id: string): Promise<Doctor | undefined> =>
    mockFetch(doctors.find((d) => d.id === id)),
};
