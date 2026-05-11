import { services } from "@/data/services";
import type { Service } from "@/types";

export const servicesService = {
  list: (): Promise<Service[]> => Promise.resolve(services),
  getById: (id: string): Promise<Service | undefined> =>
    Promise.resolve(services.find((service) => service.id === id)),
};
