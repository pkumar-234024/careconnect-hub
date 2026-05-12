import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
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
import { hospitalService } from "@/services/hospitalService";
import type { AppointmentRequest, Doctor, Hospital } from "@/types";

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
  hospitalId: "",
  patientName: "",
  patientEmail: "",
  patientPhoneNumber: "",
  doctorUserId: "",
  appointmentDateTime: "",
  reason: "",
};

function AppointmentPage() {
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [hospitalLoading, setHospitalLoading] = useState(true);
  const [doctorsLoading, setDoctorsLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<AppointmentRequest>(initialForm);

  const selectedHospital = useMemo(
    () => hospitals.find((hospital) => hospital.id === form.hospitalId),
    [hospitals, form.hospitalId],
  );

  useEffect(() => {
    let active = true;

    async function loadHospitals() {
      setHospitalLoading(true);
      try {
        const list = await hospitalService.list();
        if (!active) return;

        setHospitals(list);
        setForm((current) => ({
          ...current,
          hospitalId: current.hospitalId || list[0]?.id || "",
        }));
      } catch {
        if (active) {
          toast.error("Could not load hospitals right now.");
        }
      } finally {
        if (active) setHospitalLoading(false);
      }
    }

    void loadHospitals();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let active = true;

    async function loadDoctors() {
      if (!form.hospitalId) {
        setDoctors([]);
        return;
      }

      setDoctorsLoading(true);
      try {
        const list = await doctorsService.list(form.hospitalId);
        if (active) {
          setDoctors(list);
        }
      } finally {
        if (active) setDoctorsLoading(false);
      }
    }

    void loadDoctors();

    return () => {
      active = false;
    };
  }, [form.hospitalId]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!form.hospitalId) {
      toast.error("Please choose a hospital before booking.");
      return;
    }

    if (!form.doctorUserId) {
      toast.error("Please choose a doctor before booking.");
      return;
    }

    setLoading(true);

    try {
      await appointmentService.request({
        ...form,
        appointmentDateTime: new Date(form.appointmentDateTime).toISOString(),
      });

      toast.success("Appointment request sent. Staff will review it shortly.");
      setForm({
        ...initialForm,
        hospitalId: form.hospitalId,
      });
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
              Book your visit by choosing the right hospital first.
            </h1>
            <p className="max-w-2xl text-balance text-lg text-muted-foreground">
              Pick a hospital, choose a doctor from that location, and send your request directly
              to the backend. Admins, doctors and receptionists can approve or decline it from the
              staff dashboard.
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

              {selectedHospital ? (
                <div className="rounded-2xl border border-border/70 bg-primary-soft/40 px-4 py-3 text-sm">
                  Booking for <span className="font-medium text-foreground">{selectedHospital.name}</span>
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-border/70 px-4 py-3 text-sm text-muted-foreground">
                  {hospitalLoading ? "Loading hospitals..." : "Choose a hospital to load its doctors."}
                </div>
              )}

              <form className="space-y-5" onSubmit={handleSubmit}>
                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="space-y-2 sm:col-span-2">
                    <Label>Hospital</Label>
                    <Select
                      value={form.hospitalId}
                      onValueChange={(value) =>
                        setForm({
                          ...form,
                          hospitalId: value,
                          doctorUserId: "",
                        })
                      }
                      disabled={hospitalLoading || hospitals.length === 0}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a hospital" />
                      </SelectTrigger>
                      <SelectContent>
                        {hospitals.map((hospital) => (
                          <SelectItem key={hospital.id} value={hospital.id}>
                            {hospital.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

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
                      disabled={!form.hospitalId || doctorsLoading}
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
                    <p className="text-xs text-muted-foreground">
                      {doctorsLoading
                        ? "Loading doctors for the selected hospital..."
                        : form.hospitalId
                          ? `${doctors.length} doctor(s) available at this hospital.`
                          : "Pick a hospital to see available doctors."}
                    </p>
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
                  <Button
                    type="submit"
                    size="lg"
                    disabled={loading || hospitalLoading || !form.hospitalId || !form.doctorUserId}
                  >
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
