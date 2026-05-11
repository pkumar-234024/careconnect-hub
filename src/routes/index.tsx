import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowRight, ShieldCheck, Clock, HeartHandshake, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/common/SectionHeading";
import { ServiceCard } from "@/features/services/ServiceCard";
import { DoctorCard } from "@/features/doctors/DoctorCard";
import { servicesService } from "@/services/servicesService";
import { doctorsService } from "@/services/doctorsService";
import { testimonials } from "@/data/testimonials";
import type { Service, Doctor } from "@/types";
import heroImage from "@/assets/hero-hospital.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Meridian Health — Compassionate, Modern Medical Care" },
      {
        name: "description",
        content:
          "Trusted multi-specialty hospital offering cardiology, neurology, pediatrics, orthopedics and 24/7 emergency care. Book your appointment online.",
      },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  const [services, setServices] = useState<Service[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const stats = [
    { id: "doctors", value: "50+", label: "Specialist doctors" },
    { id: "emergency", value: "24/7", label: "Emergency care" },
    { id: "satisfaction", value: "98%", label: "Patient satisfaction" },
  ] as const;

  useEffect(() => {
    void servicesService.list().then(setServices);
    void doctorsService.list().then((d) => setDoctors(d.slice(0, 3)));
  }, []);

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-mesh">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8 lg:py-28">
          <div className="space-y-6">
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-background/70 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              Accredited multi-specialty hospital
            </span>
            <h1 className="text-balance font-display text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
              Modern medicine,{" "}
              <span className="text-primary">delivered with care.</span>
            </h1>
            <p className="max-w-xl text-balance text-lg text-muted-foreground">
              From routine checkups to advanced specialist treatment — our team is
              here to listen, diagnose and care for every step of your journey.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Button asChild size="lg">
                <Link to="/appointment">
                  Book an Appointment <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/services">Explore Services</Link>
              </Button>
            </div>
            <dl className="grid grid-cols-3 gap-6 border-t border-border/60 pt-6">
              {stats.map((stat) => (
                <div key={stat.id}>
                  <dt className="font-display text-2xl font-bold text-foreground">{stat.value}</dt>
                  <dd className="text-xs text-muted-foreground">{stat.label}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="relative">
            <div className="absolute -inset-4 -z-10 rounded-[2rem] bg-gradient-to-br from-primary/20 via-accent/30 to-transparent blur-2xl" />
            <div className="overflow-hidden rounded-3xl border border-border/60 shadow-elevated">
              <img
                src={heroImage}
                alt="Bright modern hospital lobby with natural light"
                width={1600}
                height={1024}
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Trust strip */}
      <section className="border-y border-border/60 bg-surface/60">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 py-10 sm:grid-cols-3 sm:px-6 lg:px-8">
          {[
            { icon: ShieldCheck, title: "Accredited Care", desc: "Internationally recognized standards." },
            { icon: Clock, title: "Always Open", desc: "24/7 emergency & on-call specialists." },
            { icon: HeartHandshake, title: "Patient-First", desc: "Time, empathy and clarity at every visit." },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="flex items-start gap-3">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary-soft text-primary">
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <p className="font-medium">{title}</p>
                <p className="text-sm text-muted-foreground">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Services */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Specialties"
          title="Comprehensive care, all under one roof"
          description="Our specialists work as one team — so your care is coordinated, not fragmented."
        />
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.slice(0, 6).map((s) => (
            <ServiceCard key={s.id} service={s} />
          ))}
        </div>
        <div className="mt-10 text-center">
          <Button asChild variant="outline">
            <Link to="/services">View all services</Link>
          </Button>
        </div>
      </section>

      {/* Doctors */}
      <section className="bg-surface/60 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Our Team"
            title="Meet the doctors who care for you"
          />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {doctors.map((d) => (
              <DoctorCard key={d.id} doctor={d} />
            ))}
          </div>
          <div className="mt-10 text-center">
            <Button asChild variant="outline">
              <Link to="/doctors">See all doctors</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <SectionHeading eyebrow="Patient Stories" title="Trusted by thousands" />
        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {testimonials.map((t) => (
            <figure key={t.id} className="rounded-2xl border border-border/70 bg-card p-6 shadow-soft">
              <div className="mb-3 flex gap-0.5 text-primary">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <blockquote className="text-sm leading-relaxed text-foreground">
                "{t.quote}"
              </blockquote>
              <figcaption className="mt-4 text-sm">
                <span className="font-medium">{t.name}</span>{" "}
                <span className="text-muted-foreground">· {t.role}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 pb-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl overflow-hidden rounded-3xl bg-gradient-to-br from-primary to-primary/80 p-10 text-primary-foreground shadow-elevated sm:p-14">
          <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
            <div className="space-y-3">
              <h2 className="font-display text-3xl font-bold sm:text-4xl">
                Ready to feel better?
              </h2>
              <p className="max-w-xl text-primary-foreground/85">
                Book a same-week appointment with a specialist. No paperwork,
                no waiting rooms — just care that meets you where you are.
              </p>
            </div>
            <Button asChild size="lg" variant="secondary">
              <Link to="/appointment">
                Book Now <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
