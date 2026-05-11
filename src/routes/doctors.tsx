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
      { title: "Doctors - Meridian Health" },
      {
        name: "description",
        content:
          "Meet the hospital care team and find the right doctor to book your appointment with.",
      },
      { property: "og:title", content: "Our Doctors - Meridian Health" },
      { property: "og:description", content: "The care team behind the appointment queue." },
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
      (doctor) =>
        doctor.fullName.toLowerCase().includes(q) ||
        doctor.email.toLowerCase().includes(q) ||
        doctor.phoneNumber.toLowerCase().includes(q),
    );
  }, [doctors, query]);

  return (
    <>
      <section className="bg-mesh">
        <div className="mx-auto max-w-4xl px-4 py-20 text-center sm:px-6 lg:px-8">
          <span className="inline-block rounded-full bg-primary-soft px-3 py-1 text-xs font-medium uppercase tracking-wider text-primary">
            Care team
          </span>
          <h1 className="mt-4 font-display text-4xl font-bold tracking-tight sm:text-5xl">
            Meet the doctors behind the dashboard.
          </h1>
          <p className="mt-5 text-balance text-lg text-muted-foreground">
            These staff profiles come directly from the backend doctor roster used by the booking
            flow.
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
              placeholder="Search by name, email or phone"
              className="pl-9"
            />
          </div>
        </div>

        {filtered.length === 0 ? (
          <p className="text-center text-muted-foreground">No doctors match your search.</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((doctor) => (
              <DoctorCard key={doctor.userId} doctor={doctor} />
            ))}
          </div>
        )}

        <div className="mx-auto mt-16 max-w-2xl text-center">
          <SectionHeading
            title="Need help choosing?"
            description="Book any available doctor and the staff team can route the request if needed."
          />
        </div>
      </section>
    </>
  );
}
