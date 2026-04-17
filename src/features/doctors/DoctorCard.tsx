import { Card, CardContent } from "@/components/ui/card";
import type { Doctor } from "@/types";

export function DoctorCard({ doctor }: { doctor: Doctor }) {
  return (
    <Card className="group overflow-hidden border-border/70 bg-card transition-all hover:-translate-y-1 hover:shadow-elevated">
      <div className="aspect-[4/5] w-full overflow-hidden bg-muted">
        <img
          src={doctor.image}
          alt={`Portrait of ${doctor.name}`}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <CardContent className="space-y-1.5 p-5">
        <p className="text-xs font-medium uppercase tracking-wider text-primary">
          {doctor.specialization}
        </p>
        <h3 className="font-display text-lg font-semibold">{doctor.name}</h3>
        <p className="text-sm text-muted-foreground">
          {doctor.experienceYears} yrs experience · {doctor.availability}
        </p>
        {doctor.bio && (
          <p className="pt-2 text-sm leading-relaxed text-muted-foreground">{doctor.bio}</p>
        )}
      </CardContent>
    </Card>
  );
}
