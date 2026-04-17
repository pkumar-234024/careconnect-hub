import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { SectionHeading } from "@/components/common/SectionHeading";
import { Input } from "@/components/ui/input";
import { DoctorCard } from "@/features/doctors/DoctorCard";
import { doctorsService } from "@/services/doctorsService";
import type { Doctor } from "@/types";

export const Route = createFileRoute("/doctors")({
  head: () => ({
    meta: [
      { title: "Doctors — Meridian Health" },
      {
        name: "description",
        content:
          "Meet our team of accredited specialists across cardiology, neurology, pediatrics, orthopedics, dermatology and general medicine.",
      },
      { property: "og:title", content: "Our Doctors — Meridian Health" },
      { property: "og:description", content: "Accredited specialists who put you first." },
    ],
  }),
  component: DoctorsPage,
});

function DoctorsPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    void doctorsService.list().then(setDoctors);
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return doctors;
    return doctors.filter(
      (d) =>
        d.name.toLowerCase().includes(q) ||
        d.specialization.toLowerCase().includes(q),
    );
  }, [doctors, query]);

  return (
    <>
      <section className="bg-mesh">
        <div className="mx-auto max-w-4xl px-4 py-20 text-center sm:px-6 lg:px-8">
          <span className="inline-block rounded-full bg-primary-soft px-3 py-1 text-xs font-medium uppercase tracking-wider text-primary">
            Our team
          </span>
          <h1 className="mt-4 font-display text-4xl font-bold tracking-tight sm:text-5xl">
            Meet your doctors.
          </h1>
          <p className="mt-5 text-balance text-lg text-muted-foreground">
            Experienced specialists who take the time to truly understand your
            health.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto mb-10 max-w-md">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name or specialty"
              className="pl-9"
            />
          </div>
        </div>

        {filtered.length === 0 ? (
          <p className="text-center text-muted-foreground">No doctors match your search.</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((d) => (
              <DoctorCard key={d.id} doctor={d} />
            ))}
          </div>
        )}

        <div className="mx-auto mt-16 max-w-2xl text-center">
          <SectionHeading
            title="Don't see the right specialist?"
            description="Our care team will help you find the right doctor for your condition."
          />
        </div>
      </section>
    </>
  );
}
