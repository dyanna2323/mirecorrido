import { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";

interface StatsCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  iconColor?: string;
  trend?: string;
}

export default function StatsCard({
  icon: Icon,
  label,
  value,
  iconColor = "text-primary",
  trend,
}: StatsCardProps) {
  return (
    <Card
      className="rounded-2xl p-6 hover-elevate transition-all duration-300"
      data-testid={`stats-${label.toLowerCase().replace(/\s+/g, '-')}`}
    >
      <div className="flex flex-col items-center text-center gap-3">
        <div className={`${iconColor} p-3 bg-muted rounded-xl`}>
          <Icon className="w-8 h-8" />
        </div>
        <div className="space-y-1">
          <p className="text-3xl font-bold">{value}</p>
          <p className="text-sm font-semibold text-muted-foreground">{label}</p>
          {trend && (
            <p className="text-xs text-primary font-medium">{trend}</p>
          )}
        </div>
      </div>
    </Card>
  );
}
