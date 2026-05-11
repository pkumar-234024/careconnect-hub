import { Mail, Phone, Stethoscope } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { Doctor } from "@/types";

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function DoctorCard({ doctor }: { doctor: Doctor }) {
  return (
    <Card className="group overflow-hidden border-border/70 bg-card transition-all hover:-translate-y-1 hover:shadow-elevated">
      <div className="bg-gradient-to-br from-primary/15 via-primary-soft to-accent/20 p-6">
        <div className="flex items-center justify-between">
          <div className="grid h-16 w-16 place-items-center rounded-2xl bg-primary text-primary-foreground shadow-soft">
            <span className="font-display text-lg font-bold">{getInitials(doctor.fullName)}</span>
          </div>
          <div className="rounded-full border border-border/60 bg-background/80 px-3 py-1 text-xs font-medium uppercase tracking-wider text-muted-foreground backdrop-blur">
            Doctor
          </div>
        </div>
        <div className="mt-6">
          <p className="mb-2 inline-flex items-center gap-2 rounded-full bg-background/80 px-3 py-1 text-xs font-medium text-primary backdrop-blur">
            <Stethoscope className="h-3.5 w-3.5" />
            Clinical care team
          </p>
          <h3 className="font-display text-xl font-semibold">{doctor.fullName}</h3>
        </div>
      </div>

      <CardContent className="space-y-3 p-5">
        <div className="flex items-start gap-2 text-sm text-muted-foreground">
          <Mail className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
          <span className="break-all">{doctor.email}</span>
        </div>
        <div className="flex items-start gap-2 text-sm text-muted-foreground">
          <Phone className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
          <span>{doctor.phoneNumber}</span>
        </div>
      </CardContent>
    </Card>
  );
}
