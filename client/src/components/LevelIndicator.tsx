import { Trophy } from "lucide-react";

interface LevelIndicatorProps {
  level: number;
  size?: "sm" | "md" | "lg";
}

export default function LevelIndicator({ level, size = "md" }: LevelIndicatorProps) {
  const sizes = {
    sm: { container: "w-12 h-12", text: "text-sm", icon: "w-3 h-3" },
    md: { container: "w-16 h-16", text: "text-lg", icon: "w-4 h-4" },
    lg: { container: "w-24 h-24", text: "text-2xl", icon: "w-6 h-6" },
  };

  const s = sizes[size];

  return (
    <div
      className={`${s.container} rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center relative shadow-lg`}
      data-testid="level-indicator"
    >
      <div className="absolute -top-1 -right-1 bg-yellow-400 rounded-full p-1">
        <Trophy className={`${s.icon} text-yellow-900`} />
      </div>
      <span className={`${s.text} font-bold text-white`}>{level}</span>
    </div>
  );
}
