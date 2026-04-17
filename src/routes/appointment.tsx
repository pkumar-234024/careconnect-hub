import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { CalendarCheck2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { doctorsService } from "@/services/doctorsService";
import { servicesService } from "@/services/servicesService";
import { appointmentService } from "@/services/appointmentService";
import type { AppointmentRequest, Doctor, Service } from "@/types";

export const Route = createFileRoute("/appointment")({
  head: () => ({
    meta: [
      { title: "Book an Appointment — Meridian Health" },
      {
        name: "description",
        content:
          "Request an appointment with a Meridian Health specialist. Choose your doctor, service and preferred date.",
      },
      { property: "og:title", content: "Book an Appointment — Meridian Health" },
      { property: "og:description", content: "Specialist care, just a few clicks away." },
    ],
  }),
  component: AppointmentPage,
});

function AppointmentPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<AppointmentRequest>({
    fullName: "",
    email: "",
    phone: "",
    doctorId: "",
    serviceId: "",
    preferredDate: "",
    notes: "",
  });

  useEffect(() => {
    void doctorsService.list().then(setDoctors);
    void servicesService.list().then(setServices);
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await appointmentService.request(form);
      toast.success("Appointment requested — we'll confirm shortly.");
      setForm({
        fullName: "",
        email: "",
        phone: "",
        doctorId: "",
        serviceId: "",
        preferredDate: "",
        notes: "",
      });
    } catch {
      toast.error("Could not submit. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <section className="bg-mesh">
        <div className="mx-auto max-w-4xl px-4 py-20 text-center sm:px-6 lg:px-8">
          <span className="inline-block rounded-full bg-primary-soft px-3 py-1 text-xs font-medium uppercase tracking-wider text-primary">
            Appointments
          </span>
          <h1 className="mt-4 font-display text-4xl font-bold tracking-tight sm:text-5xl">
            Book your visit in under a minute.
          </h1>
          <p className="mt-5 text-balance text-lg text-muted-foreground">
            Tell us a bit about you, and our care team will confirm your slot
            within one business day.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 pb-24 sm:px-6 lg:px-8">
        <form
          onSubmit={handleSubmit}
          className="space-y-6 rounded-3xl border border-border/70 bg-card p-6 shadow-elevated sm:p-10"
        >
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary text-primary-foreground">
              <CalendarCheck2 className="h-5 w-5" />
            </div>
            <h2 className="font-display text-xl font-semibold">Appointment details</h2>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full name</Label>
              <Input id="fullName" required value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="preferredDate">Preferred date</Label>
              <Input
                id="preferredDate"
                type="date"
                required
                value={form.preferredDate}
                onChange={(e) => setForm({ ...form, preferredDate: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Service</Label>
              <Select
                value={form.serviceId}
                onValueChange={(v) => setForm({ ...form, serviceId: v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a service" />
                </SelectTrigger>
                <SelectContent>
                  {services.map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Preferred doctor</Label>
              <Select
                value={form.doctorId}
                onValueChange={(v) => setForm({ ...form, doctorId: v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Any available" />
                </SelectTrigger>
                <SelectContent>
                  {doctors.map((d) => (
                    <SelectItem key={d.id} value={d.id}>
                      {d.name} — {d.specialization}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes (optional)</Label>
            <Textarea
              id="notes"
              rows={4}
              placeholder="Briefly describe what you'd like to discuss."
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
            />
          </div>

          <div className="flex flex-col items-start gap-3 border-t border-border/60 pt-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-muted-foreground">
              By submitting, you agree to be contacted regarding your appointment.
            </p>
            <Button type="submit" size="lg" disabled={loading}>
              {loading ? "Submitting…" : "Request appointment"}
            </Button>
          </div>
        </form>
      </section>
    </>
  );
}
