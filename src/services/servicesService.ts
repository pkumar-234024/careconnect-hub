import { services } from "@/data/services";
import type { Service } from "@/types";
import { mockFetch } from "./api/client";

export const servicesService = {
  list: (): Promise<Service[]> => mockFetch(services),
  getById: (id: string): Promise<Service | undefined> =>
    mockFetch(services.find((s) => s.id === id)),
};
