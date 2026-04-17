import { Card, CardContent } from "@/components/ui/card";
import * as Icons from "lucide-react";
import type { Service } from "@/types";
import type { LucideIcon } from "lucide-react";

export function ServiceCard({ service }: { service: Service }) {
  const Icon = (Icons[service.icon as keyof typeof Icons] ?? Icons.Activity) as LucideIcon;

  return (
    <Card className="group h-full border-border/70 bg-card transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-elevated">
      <CardContent className="space-y-4 p-6">
        <div className="grid h-12 w-12 place-items-center rounded-2xl bg-primary-soft text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
          <Icon className="h-6 w-6" />
        </div>
        <div className="space-y-1.5">
          <h3 className="font-display text-lg font-semibold">{service.title}</h3>
          <p className="text-sm leading-relaxed text-muted-foreground">{service.description}</p>
        </div>
        {service.highlights && (
          <ul className="flex flex-wrap gap-1.5 pt-1">
            {service.highlights.map((h) => (
              <li
                key={h}
                className="rounded-full bg-secondary px-2.5 py-1 text-xs text-secondary-foreground"
              >
                {h}
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
