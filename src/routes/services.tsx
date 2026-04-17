import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SectionHeading } from "@/components/common/SectionHeading";
import { ServiceCard } from "@/features/services/ServiceCard";
import { servicesService } from "@/services/servicesService";
import type { Service } from "@/types";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Services — Meridian Health" },
      {
        name: "description",
        content:
          "Explore Meridian Health's full range of medical specialties — cardiology, neurology, pediatrics, orthopedics, dermatology and 24/7 emergency care.",
      },
      { property: "og:title", content: "Our Services — Meridian Health" },
      { property: "og:description", content: "Specialist care across every major medical field." },
    ],
  }),
  component: ServicesPage,
});

function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);

  useEffect(() => {
    void servicesService.list().then(setServices);
  }, []);

  return (
    <>
      <section className="bg-mesh">
        <div className="mx-auto max-w-4xl px-4 py-20 text-center sm:px-6 lg:px-8">
          <span className="inline-block rounded-full bg-primary-soft px-3 py-1 text-xs font-medium uppercase tracking-wider text-primary">
            Services
          </span>
          <h1 className="mt-4 font-display text-4xl font-bold tracking-tight sm:text-5xl">
            Specialist care, made simple.
          </h1>
          <p className="mt-5 text-balance text-lg text-muted-foreground">
            Every specialty under one roof — coordinated by one team that
            communicates with each other and with you.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <SectionHeading title="What we offer" />
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => (
            <ServiceCard key={s.id} service={s} />
          ))}
        </div>
      </section>
    </>
  );
}
