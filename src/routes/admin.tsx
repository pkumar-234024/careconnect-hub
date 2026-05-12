import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  LogOut,
  ShieldAlert,
  UserRound,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";
import { SectionHeading } from "@/components/common/SectionHeading";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ApiError } from "@/services/api/client";
import { appointmentService, authService } from "@/services/appointmentService";
import { doctorsService } from "@/services/doctorsService";
import type { AppointmentRecord, AppointmentStatus, AuthStatusResponse, Doctor } from "@/types";

type ViewFilter = "All" | AppointmentStatus;

const staffRoles = new Set(["Admin", "Doctor", "Receptionist"]);

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Staff Dashboard - Meridian Health" },
      {
        name: "description",
        content: "Approve, decline and review appointment requests from the hospital backend.",
      },
    ],
  }),
  component: AdminPage,
});

function AdminPage() {
  const [auth, setAuth] = useState<AuthStatusResponse | null>(null);
  const [loginEmail, setLoginEmail] = useState("admin@hospital.com");
  const [loginPassword, setLoginPassword] = useState("Admin@123");
  const [authLoading, setAuthLoading] = useState(true);
  const [loginLoading, setLoginLoading] = useState(false);
  const [appointments, setAppointments] = useState<AppointmentRecord[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [appointmentsLoading, setAppointmentsLoading] = useState(false);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [filter, setFilter] = useState<ViewFilter>("All");
  const [declineTarget, setDeclineTarget] = useState<AppointmentRecord | null>(null);
  const [declineReason, setDeclineReason] = useState("");

  useEffect(() => {
    let active = true;

    async function bootstrap() {
      try {
        const session = await authService.status();

        if (!active) return;

        setAuth(session);
        if (session.isAuthenticated) {
          await loadDashboard(session.hospitalId);
        }
      } catch {
        if (active) {
          setAuth(null);
        }
      } finally {
        if (active) setAuthLoading(false);
      }
    }

    async function loadDashboard(hospitalId?: string | null) {
      setAppointmentsLoading(true);
      try {
        const [appointmentPage, doctorList] = await Promise.all([
          appointmentService.list(1, 100),
          doctorsService.list(hospitalId ?? undefined),
        ]);

        if (!active) return;

        setAppointments(appointmentPage.items);
        setDoctors(doctorList);
      } finally {
        if (active) setAppointmentsLoading(false);
      }
    }

    void bootstrap();

    return () => {
      active = false;
    };
  }, []);

  const doctorById = useMemo(
    () => new Map(doctors.map((doctor) => [doctor.userId, doctor])),
    [doctors],
  );

  const visibleAppointments = useMemo(() => {
    if (filter === "All") return appointments;
    return appointments.filter((appointment) => appointment.status === filter);
  }, [appointments, filter]);

  const pendingCount = appointments.filter((appointment) => appointment.status === "Pending").length;
  const approvedCount = appointments.filter((appointment) => appointment.status === "Approved").length;
  const declinedCount = appointments.filter((appointment) => appointment.status === "Declined").length;

  const isStaff = auth?.roles?.some((role) => staffRoles.has(role)) ?? false;

  async function refreshAppointments(hospitalId?: string | null) {
    setAppointmentsLoading(true);
    try {
      const [appointmentPage, doctorList] = await Promise.all([
        appointmentService.list(1, 100),
        doctorsService.list(hospitalId ?? undefined),
      ]);

      setAppointments(appointmentPage.items);
      setDoctors(doctorList);
    } finally {
      setAppointmentsLoading(false);
    }
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoginLoading(true);

    try {
      const response = await authService.login(loginEmail, loginPassword);

      if (!response.success) {
        toast.error(response.message || "Login failed.");
        return;
      }

      const session = await authService.status();
      setAuth(session);
      await refreshAppointments(session.hospitalId);
      toast.success("Signed in successfully.");
    } catch (error) {
      if (error instanceof ApiError) {
        toast.error(error.message);
      } else {
        toast.error("Login failed. Check your email and password.");
      }
    } finally {
      setLoginLoading(false);
    }
  }

  async function handleLogout() {
    try {
      await authService.logout();
    } finally {
      setAuth(null);
      setAppointments([]);
      setDoctors([]);
      toast.success("Signed out.");
    }
  }

  async function handleApprove(id: string) {
    setSavingId(id);
    try {
      const updated = await appointmentService.approve(id);
      setAppointments((current) => current.map((item) => (item.id === updated.id ? updated : item)));
      toast.success(`Approved ${updated.patientName}.`);
    } catch (error) {
      if (error instanceof ApiError) {
        toast.error(error.message);
      } else {
        toast.error("Approval failed. Please try again.");
      }
    } finally {
      setSavingId(null);
    }
  }

  async function handleDeclineSubmit() {
    if (!declineTarget) return;

    setSavingId(declineTarget.id);
    try {
      const updated = await appointmentService.decline(declineTarget.id, declineReason.trim());
      setAppointments((current) => current.map((item) => (item.id === updated.id ? updated : item)));
      setDeclineTarget(null);
      setDeclineReason("");
      toast.success(`Declined ${updated.patientName}.`);
    } catch (error) {
      if (error instanceof ApiError) {
        toast.error(error.message);
      } else {
        toast.error("Decline failed. Please try again.");
      }
    } finally {
      setSavingId(null);
    }
  }

  if (authLoading) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-2xl items-center justify-center px-4">
        <p className="text-sm text-muted-foreground">Checking staff session...</p>
      </div>
    );
  }

  if (!auth?.isAuthenticated || !isStaff) {
    return (
      <section className="bg-mesh">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8 lg:py-20">
          <div className="space-y-6">
            <span className="inline-block rounded-full bg-primary-soft px-3 py-1 text-xs font-medium uppercase tracking-wider text-primary">
              Staff access
            </span>
            <h1 className="font-display text-4xl font-bold tracking-tight sm:text-5xl">
              Hospital operations dashboard
            </h1>
            <p className="max-w-2xl text-balance text-lg text-muted-foreground">
              Sign in with the backend staff account to review appointment requests, approve
              meetings and decline with a note when needed.
            </p>
            {auth?.isAuthenticated && !isStaff && (
              <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-amber-800">
                You are signed in, but your account does not have a staff role. Use an Admin,
                Doctor or Receptionist account to open the queue.
              </div>
            )}
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                { label: "Pending", value: pendingCount, icon: CalendarDays },
                { label: "Approved", value: approvedCount, icon: CheckCircle2 },
                { label: "Declined", value: declinedCount, icon: XCircle },
              ].map(({ label, value, icon: Icon }) => (
                <Card key={label} className="border-border/70 bg-card/80 backdrop-blur">
                  <CardContent className="flex items-center gap-4 p-5">
                    <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary-soft text-primary">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">{label}</p>
                      <p className="font-display text-2xl font-bold">{value}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <Card className="border-border/70 bg-card shadow-elevated">
            <CardContent className="space-y-5 p-6 sm:p-8">
              <div className="flex items-center gap-3">
                <div className="grid h-11 w-11 place-items-center rounded-xl bg-primary text-primary-foreground">
                  <ShieldAlert className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="font-display text-xl font-semibold">Staff sign in</h2>
                  <p className="text-sm text-muted-foreground">
                    Use the seeded backend account to access the queue.
                  </p>
                </div>
              </div>

              <form className="space-y-4" onSubmit={handleLogin}>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    autoComplete="email"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    autoComplete="current-password"
                    required
                  />
                </div>

                <Button type="submit" className="w-full" disabled={loginLoading}>
                  {loginLoading ? "Signing in..." : "Sign in"}
                </Button>
              </form>

              <p className="text-xs text-muted-foreground">
                Seeded demo credentials in the backend include `admin@hospital.com / Admin@123`.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="bg-mesh">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <span className="inline-block rounded-full bg-primary-soft px-3 py-1 text-xs font-medium uppercase tracking-wider text-primary">
                Staff
              </span>
              <h1 className="mt-4 font-display text-4xl font-bold tracking-tight sm:text-5xl">
                Appointment operations
              </h1>
              <p className="mt-4 text-balance text-lg text-muted-foreground">
                Review incoming requests from the public site, then approve or decline them for
                the care team.
              </p>
              <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-border/70 bg-card/80 px-3 py-1 text-xs font-medium text-muted-foreground">
                <span className="h-2 w-2 rounded-full bg-primary" />
                {auth?.hospitalName ? `Scoped to ${auth.hospitalName}` : "Platform-wide access"}
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button asChild variant="outline">
                <Link to="/appointment">Open public booking</Link>
              </Button>
              <Button variant="ghost" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Sign out
              </Button>
            </div>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {[
              { label: "Total loaded", value: appointments.length, icon: ClipboardList },
              { label: "Pending", value: pendingCount, icon: CalendarDays },
              { label: "Approved", value: approvedCount, icon: CheckCircle2 },
            ].map(({ label, value, icon: Icon }) => (
              <Card key={label} className="border-border/70 bg-card/80 backdrop-blur">
                <CardContent className="flex items-center gap-4 p-5">
                  <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-primary-soft text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{label}</p>
                    <p className="font-display text-2xl font-bold">{value}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-border/70 bg-card p-6 shadow-elevated sm:p-8">
          <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <SectionHeading
              eyebrow="Queue"
              title="Recent appointment requests"
              description="Use the filters below to review the queue by status."
            />

            <div className="flex flex-wrap gap-2">
              {(["All", "Pending", "Approved", "Declined"] as ViewFilter[]).map((value) => (
                <Button
                  key={value}
                  variant={filter === value ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilter(value)}
                >
                  {value}
                </Button>
              ))}
            </div>
          </div>

          {appointmentsLoading ? (
            <p className="py-12 text-center text-sm text-muted-foreground">
              Loading appointments...
            </p>
          ) : visibleAppointments.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border/70 p-10 text-center">
              <UserRound className="mx-auto h-10 w-10 text-muted-foreground" />
              <h2 className="mt-4 font-display text-xl font-semibold">No appointments found</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Try a different filter or wait for new requests from the public booking form.
              </p>
            </div>
          ) : (
            <div className="overflow-hidden rounded-2xl border border-border/60">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Hospital</TableHead>
                    <TableHead>Patient</TableHead>
                    <TableHead>Doctor</TableHead>
                    <TableHead>Schedule</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {visibleAppointments.map((appointment) => {
                    const doctor = doctorById.get(appointment.doctorUserId);

                    return (
                      <TableRow key={appointment.id}>
                        <TableCell className="min-w-44">
                          <div className="font-medium">
                            {appointment.hospitalName || auth?.hospitalName || "Unknown hospital"}
                          </div>
                        </TableCell>
                        <TableCell className="min-w-52">
                          <div className="font-medium">{appointment.patientName}</div>
                          <div className="text-xs text-muted-foreground">{appointment.patientEmail}</div>
                          <div className="text-xs text-muted-foreground">{appointment.patientPhoneNumber}</div>
                        </TableCell>
                        <TableCell className="min-w-48">
                          <div>{appointment.doctorName || doctor?.fullName || "Unassigned"}</div>
                          <div className="text-xs text-muted-foreground">
                            {doctor?.email || "Doctor profile not loaded"}
                          </div>
                        </TableCell>
                        <TableCell className="min-w-52">
                          <div>
                            {new Date(appointment.appointmentDateTime).toLocaleString(undefined, {
                              dateStyle: "medium",
                              timeStyle: "short",
                            })}
                          </div>
                          <div className="text-xs text-muted-foreground">{appointment.reason}</div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={statusVariant(appointment.status)}>
                            {appointment.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              size="sm"
                              disabled={appointment.status !== "Pending" || savingId === appointment.id}
                              onClick={() => handleApprove(appointment.id)}
                            >
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              disabled={appointment.status !== "Pending" || savingId === appointment.id}
                              onClick={() => setDeclineTarget(appointment)}
                            >
                              Decline
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </section>

      <Dialog
        open={declineTarget !== null}
        onOpenChange={(open) => {
          if (!open) {
            setDeclineTarget(null);
            setDeclineReason("");
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Decline appointment</DialogTitle>
            <DialogDescription>
              Add an optional note so the patient and care team know why the request was not
              approved.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2">
            <Label htmlFor="declineReason">Reason</Label>
            <Textarea
              id="declineReason"
              rows={4}
              value={declineReason}
              onChange={(e) => setDeclineReason(e.target.value)}
              placeholder="Optional note for the patient"
            />
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDeclineTarget(null)}>
              Cancel
            </Button>
            <Button onClick={handleDeclineSubmit} disabled={savingId === declineTarget?.id}>
              {savingId === declineTarget?.id ? "Declining..." : "Decline appointment"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

function statusVariant(status: AppointmentStatus) {
  switch (status) {
    case "Approved":
      return "default";
    case "Declined":
      return "destructive";
    case "Cancelled":
      return "secondary";
    default:
      return "outline";
  }
}
