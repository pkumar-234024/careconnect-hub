import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { CalendarCheck2, Clock3, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
import { ApiError } from "@/services/api/client";
import { appointmentService } from "@/services/appointmentService";
import { doctorsService } from "@/services/doctorsService";
import type { AppointmentRequest, Doctor } from "@/types";

export const Route = createFileRoute("/appointment")({
  head: () => ({
    meta: [
      { title: "Book an Appointment - Meridian Health" },
      {
        name: "description",
        content:
          "Request an appointment with a Meridian Health doctor and let the staff approve or decline it from the hospital dashboard.",
      },
      { property: "og:title", content: "Book an Appointment - Meridian Health" },
      { property: "og:description", content: "A smoother booking flow for patients and staff." },
    ],
  }),
  component: AppointmentPage,
});

const initialForm: AppointmentRequest = {
  patientName: "",
  patientEmail: "",
  patientPhoneNumber: "",
  doctorUserId: "",
  appointmentDateTime: "",
  reason: "",
};

function AppointmentPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<AppointmentRequest>(initialForm);

  useEffect(() => {
    void doctorsService.list().then(setDoctors);
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      await appointmentService.request({
        ...form,
        appointmentDateTime: new Date(form.appointmentDateTime).toISOString(),
      });

      toast.success("Appointment request sent. Staff will review it shortly.");
      setForm(initialForm);
    } catch (error) {
      if (error instanceof ApiError) {
        toast.error(error.message);
      } else {
        toast.error("Could not submit the appointment request.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <section className="bg-mesh">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-20">
          <div className="space-y-6">
            <span className="inline-block rounded-full bg-primary-soft px-3 py-1 text-xs font-medium uppercase tracking-wider text-primary">
              Appointments
            </span>
            <h1 className="font-display text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Book your visit and let staff confirm the slot.
            </h1>
            <p className="max-w-2xl text-balance text-lg text-muted-foreground">
              Choose a doctor, pick a date and time, and send your request directly to the hospital
              backend. Admins, doctors and receptionists can approve or decline from the staff
              dashboard.
            </p>

            <div className="grid gap-4 sm:grid-cols-3">
              {[
                { icon: Clock3, title: "Fast booking", desc: "Submit in under a minute." },
                { icon: ShieldCheck, title: "Staff review", desc: "Nothing is finalized until approved." },
                { icon: CalendarCheck2, title: "Clear follow-up", desc: "Every request is tracked in the queue." },
              ].map(({ icon: Icon, title, desc }) => (
                <Card key={title} className="border-border/70 bg-card/80 backdrop-blur">
                  <CardContent className="space-y-3 p-5">
                    <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary-soft text-primary">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h2 className="font-medium">{title}</h2>
                      <p className="text-sm text-muted-foreground">{desc}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <Card className="border-border/70 bg-card shadow-elevated">
            <CardContent className="space-y-6 p-6 sm:p-8">
              <div className="flex items-center gap-3">
                <div className="grid h-11 w-11 place-items-center rounded-xl bg-primary text-primary-foreground">
                  <CalendarCheck2 className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="font-display text-xl font-semibold">Appointment request</h2>
                  <p className="text-sm text-muted-foreground">
                    Fill in the details and send the request to the hospital team.
                  </p>
                </div>
              </div>

              <form className="space-y-5" onSubmit={handleSubmit}>
                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="patientName">Patient name</Label>
                    <Input
                      id="patientName"
                      required
                      value={form.patientName}
                      onChange={(e) => setForm({ ...form, patientName: e.target.value })}
                      placeholder="Full name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="patientEmail">Email</Label>
                    <Input
                      id="patientEmail"
                      type="email"
                      required
                      value={form.patientEmail}
                      onChange={(e) => setForm({ ...form, patientEmail: e.target.value })}
                      placeholder="name@example.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="patientPhoneNumber">Phone</Label>
                    <Input
                      id="patientPhoneNumber"
                      required
                      value={form.patientPhoneNumber}
                      onChange={(e) => setForm({ ...form, patientPhoneNumber: e.target.value })}
                      placeholder="+1 555 000 0000"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="appointmentDateTime">Date and time</Label>
                    <Input
                      id="appointmentDateTime"
                      type="datetime-local"
                      required
                      value={form.appointmentDateTime}
                      onChange={(e) => setForm({ ...form, appointmentDateTime: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <Label>Doctor</Label>
                    <Select
                      value={form.doctorUserId}
                      onValueChange={(value) => setForm({ ...form, doctorUserId: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a doctor" />
                      </SelectTrigger>
                      <SelectContent>
                        {doctors.map((doctor) => (
                          <SelectItem key={doctor.userId} value={doctor.userId}>
                            {doctor.fullName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reason">Reason for visit</Label>
                  <Textarea
                    id="reason"
                    rows={4}
                    required
                    value={form.reason}
                    onChange={(e) => setForm({ ...form, reason: e.target.value })}
                    placeholder="Tell the staff what you need help with."
                  />
                </div>

                <div className="flex flex-col items-start gap-3 border-t border-border/60 pt-6 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-xs text-muted-foreground">
                    Your request will appear in the staff dashboard as pending until reviewed.
                  </p>
                  <Button type="submit" size="lg" disabled={loading}>
                    {loading ? "Submitting..." : "Request appointment"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>
    </>
  );
}
