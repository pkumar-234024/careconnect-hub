import { createFileRoute } from "@tanstack/react-router";
import { CheckCircle2 } from "lucide-react";
import { SectionHeading } from "@/components/common/SectionHeading";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Meridian Health" },
      {
        name: "description",
        content:
          "Learn about Meridian Health — our mission, our values and the care philosophy that puts patients first.",
      },
      { property: "og:title", content: "About — Meridian Health" },
      { property: "og:description", content: "Patient-first care, modern medicine." },
    ],
  }),
  component: AboutPage,
});

const values = [
  { title: "Compassion", desc: "We treat people, not symptoms." },
  { title: "Excellence", desc: "Evidence-based medicine, modern facilities." },
  { title: "Integrity", desc: "Transparent care, honest conversations." },
  { title: "Community", desc: "Health that serves the people around us." },
];

function AboutPage() {
  return (
    <>
      <section className="bg-mesh">
        <div className="mx-auto max-w-4xl px-4 py-20 text-center sm:px-6 lg:px-8 lg:py-28">
          <span className="inline-block rounded-full bg-primary-soft px-3 py-1 text-xs font-medium uppercase tracking-wider text-primary">
            About us
          </span>
          <h1 className="mt-4 text-balance font-display text-4xl font-bold tracking-tight sm:text-5xl">
            A hospital built around the people it serves.
          </h1>
          <p className="mt-5 text-balance text-lg text-muted-foreground">
            Meridian Health was founded on a simple idea: medicine works best
            when it's personal. We combine specialist expertise with a calm,
            human-centered experience.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div className="space-y-4">
            <h2 className="font-display text-3xl font-semibold">Our mission</h2>
            <p className="text-muted-foreground">
              To deliver world-class medical care with warmth, honesty and clarity —
              ensuring every patient walks away understanding their health and
              empowered to act on it.
            </p>
            <p className="text-muted-foreground">
              From our 24/7 emergency wing to our dedicated outpatient clinics,
              every part of Meridian is designed around one question: would we
              want our family treated here?
            </p>
          </div>
          <div className="overflow-hidden rounded-3xl border border-border/60 shadow-soft">
            <img
              src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1200&q=80&auto=format&fit=crop"
              alt="Doctors in a modern clinic"
              loading="lazy"
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </section>

      <section className="bg-surface/60 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading eyebrow="What we stand for" title="Our values" />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v) => (
              <div
                key={v.title}
                className="rounded-2xl border border-border/70 bg-card p-6 shadow-soft"
              >
                <CheckCircle2 className="mb-3 h-6 w-6 text-primary" />
                <h3 className="font-display text-lg font-semibold">{v.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
