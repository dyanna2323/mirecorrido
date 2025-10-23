import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Lock, Sparkles } from "lucide-react";

interface AchievementBadgeProps {
  title: string;
  description: string;
  icon: string;
  xpReward: number;
  rarity: string;
  unlocked?: boolean;
}

export default function AchievementBadge({
  title,
  description,
  icon,
  xpReward,
  rarity,
  unlocked = false,
}: AchievementBadgeProps) {
  const rarityColors: Record<string, string> = {
    common: "from-gray-400 to-gray-600",
    comun: "from-gray-400 to-gray-600",
    rare: "from-blue-400 to-blue-600",
    raro: "from-blue-400 to-blue-600",
    epic: "from-purple-400 to-purple-600",
    epico: "from-purple-400 to-purple-600",
    legendary: "from-yellow-400 to-yellow-600",
    legendario: "from-yellow-400 to-yellow-600",
  };

  const rarityBadgeColors: Record<string, string> = {
    common: "bg-gray-100 text-gray-700",
    comun: "bg-gray-100 text-gray-700",
    rare: "bg-blue-100 text-blue-700",
    raro: "bg-blue-100 text-blue-700",
    epic: "bg-purple-100 text-purple-700",
    epico: "bg-purple-100 text-purple-700",
    legendary: "bg-yellow-100 text-yellow-700",
    legendario: "bg-yellow-100 text-yellow-700",
  };

  return (
    <Card
      className={`rounded-3xl p-6 text-center space-y-3 hover-elevate transition-all duration-300 ${
        !unlocked ? "opacity-60" : ""
      } ${unlocked ? "animate-pulse-slow" : ""}`}
      data-testid={`achievement-${title.toLowerCase().replace(/\s+/g, '-')}`}
    >
      <div
        className={`relative w-20 h-20 mx-auto rounded-full bg-gradient-to-br ${
          rarityColors[rarity.toLowerCase()] || rarityColors.common
        } flex items-center justify-center shadow-lg`}
      >
        {unlocked ? (
          <>
            <span className="text-4xl">{icon}</span>
            <Sparkles className="absolute -top-1 -right-1 w-5 h-5 text-yellow-400 fill-yellow-400" />
          </>
        ) : (
          <Lock className="w-8 h-8 text-white" />
        )}
      </div>

      <div className="space-y-2">
        <h3 className="text-base font-bold">{title}</h3>
        <p className="text-xs text-muted-foreground leading-relaxed">{description}</p>
      </div>

      <div className="flex flex-col gap-2 items-center">
        <Badge className={`${rarityBadgeColors[rarity.toLowerCase()]} rounded-lg text-xs`}>
          {rarity}
        </Badge>
        {unlocked && (
          <Badge variant="outline" className="rounded-lg text-xs">
            +{xpReward} XP
          </Badge>
        )}
      </div>
    </Card>
  );
}
