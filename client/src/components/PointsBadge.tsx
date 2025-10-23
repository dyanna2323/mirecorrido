import { Star, Coins } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface PointsBadgeProps {
  points: number;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "outline";
  showIcon?: boolean;
}

export default function PointsBadge({
  points,
  size = "md",
  variant = "default",
  showIcon = true,
}: PointsBadgeProps) {
  const sizeClasses = {
    sm: "text-sm px-2 py-1",
    md: "text-base px-3 py-1.5",
    lg: "text-xl px-4 py-2",
  };

  const iconSizes = {
    sm: "w-3 h-3",
    md: "w-4 h-4",
    lg: "w-5 h-5",
  };

  return (
    <Badge
      variant={variant}
      className={`${sizeClasses[size]} bg-yellow-500 hover:bg-yellow-600 text-yellow-950 font-bold gap-1.5 rounded-xl`}
      data-testid="points-badge"
    >
      {showIcon && <Star className={`${iconSizes[size]} fill-current`} />}
      <span>{points.toLocaleString()}</span>
    </Badge>
  );
}
