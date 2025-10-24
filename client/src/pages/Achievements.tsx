import AchievementBadge from "@/components/AchievementBadge";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import type { Achievement, UserAchievement } from "@shared/schema";

type UserAchievementWithAchievement = UserAchievement & { achievement: Achievement };

type AchievementWithUserData = Achievement & {
  unlocked: boolean;
  unlockedAt?: Date;
};

export default function Achievements() {
  const [selectedRarity, setSelectedRarity] = useState("todos");
  const { user, isLoading: authLoading } = useAuth();

  const { data: allAchievements, isLoading: achievementsLoading } = useQuery<Achievement[]>({
    queryKey: ["/api/achievements"],
  });

  const { data: userAchievements, isLoading: userAchievementsLoading } = useQuery<UserAchievementWithAchievement[]>({
    queryKey: ["/api/me/achievements"],
    enabled: !!user,
  });

  const isLoading = authLoading || achievementsLoading || userAchievementsLoading;

  const mergedAchievements: AchievementWithUserData[] = (allAchievements || []).map((achievement) => {
    const userAchievement = (userAchievements || []).find(
      (ua) => ua.achievementId === achievement.id
    );

    return {
      ...achievement,
      unlocked: !!userAchievement,
      unlockedAt: userAchievement?.unlockedAt,
    };
  });

  const rarities = [
    { value: "todos", label: "Todos" },
    { value: "común", label: "Común" },
    { value: "raro", label: "Raro" },
    { value: "épico", label: "Épico" },
    { value: "legendario", label: "Legendario" },
  ];

  const filteredAchievements = selectedRarity === "todos"
    ? mergedAchievements
    : mergedAchievements.filter((a) => a.rarity === selectedRarity);

  const unlockedCount = mergedAchievements.filter((a) => a.unlocked).length;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="pt-20 md:pt-24 pb-24 md:pb-8">
          <div className="max-w-7xl mx-auto px-4 space-y-6">
            <div>
              <Skeleton className="h-12 w-64 mb-2" />
              <Skeleton className="h-6 w-96" />
            </div>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-10 w-24 rounded-xl" />
              ))}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
                <Skeleton key={i} className="h-40 rounded-3xl" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="pt-20 md:pt-24 pb-24 md:pb-8">
        <div className="max-w-7xl mx-auto px-4 space-y-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Mis Logros</h1>
            <p className="text-muted-foreground text-lg">
              Has desbloqueado {unlockedCount} de {mergedAchievements.length} logros
            </p>
          </div>

          {/* Rarity Filters */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {rarities.map((rarity) => (
              <Badge
                key={rarity.value}
                onClick={() => setSelectedRarity(rarity.value)}
                className={`cursor-pointer px-4 py-2 rounded-xl text-sm whitespace-nowrap hover-elevate ${
                  selectedRarity === rarity.value
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
                data-testid={`filter-${rarity.value}`}
              >
                {rarity.label}
              </Badge>
            ))}
          </div>

          {/* Achievements Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {filteredAchievements.map((achievement) => (
              <AchievementBadge
                key={achievement.id}
                title={achievement.title}
                description={achievement.description}
                icon={achievement.icon}
                xpReward={achievement.xpReward}
                rarity={achievement.rarity}
                unlocked={achievement.unlocked}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
