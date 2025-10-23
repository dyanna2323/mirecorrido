import { Progress } from "@/components/ui/progress";

interface ProgressBarProps {
  current: number;
  max: number;
  label?: string;
  showPercentage?: boolean;
  height?: "sm" | "md" | "lg";
  color?: string;
}

export default function ProgressBar({
  current,
  max,
  label,
  showPercentage = true,
  height = "md",
  color,
}: ProgressBarProps) {
  const percentage = Math.min((current / max) * 100, 100);
  
  const heightClasses = {
    sm: "h-2",
    md: "h-4",
    lg: "h-6",
  };

  return (
    <div className="space-y-2" data-testid="progress-bar">
      {(label || showPercentage) && (
        <div className="flex justify-between items-center text-sm">
          {label && <span className="font-semibold">{label}</span>}
          {showPercentage && (
            <span className="text-muted-foreground font-medium">
              {current} / {max}
            </span>
          )}
        </div>
      )}
      <div className="relative">
        <Progress
          value={percentage}
          className={`${heightClasses[height]} ${color || ""}`}
        />
      </div>
    </div>
  );
}
