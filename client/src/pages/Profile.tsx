import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import StatsCard from "@/components/StatsCard";
import ProgressBar from "@/components/ProgressBar";
import PenaltyModal from "@/components/PenaltyModal";
import { Star, Trophy, Flame, Target, AlertCircle, Settings } from "lucide-react";
import LevelIndicator from "@/components/LevelIndicator";
import { useAuth } from "@/hooks/useAuth";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { User, UserStats, ActivityLog } from "@shared/schema";
import { format } from "date-fns";
import { es } from "date-fns/locale";

type ProfileData = {
  user: User;
  stats: UserStats;
};

export default function Profile() {
  const [penaltyModalOpen, setPenaltyModalOpen] = useState(false);
  const { user, isLoading: authLoading } = useAuth();
  const { toast } = useToast();

  const { data: profileData, isLoading: profileLoading } = useQuery<ProfileData>({
    queryKey: ["/api/me"],
    enabled: !!user,
  });

  const { data: activityLog, isLoading: activityLoading } = useQuery<ActivityLog[]>({
    queryKey: ["/api/me/activity"],
    enabled: !!user,
  });

  const isLoading = authLoading || profileLoading || activityLoading;

  const applyPenaltyMutation = useMutation({
    mutationFn: async ({ points, reason }: { points: number; reason: string }) => {
      const res = await apiRequest("POST", "/api/me/penalty", { points, reason });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/me"] });
      queryClient.invalidateQueries({ queryKey: ["/api/me/activity"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard"] });
      toast({
        title: "Penalización Aplicada",
        description: "La penalización se ha registrado correctamente",
      });
      setPenaltyModalOpen(false);
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "No se pudo aplicar la penalización",
        variant: "destructive",
      });
    },
  });

  const handleApplyPenalty = (points: number, reason: string) => {
    applyPenaltyMutation.mutate({ points, reason });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="pt-20 md:pt-24 pb-24 md:pb-8">
          <div className="max-w-7xl mx-auto px-4 space-y-6">
            <div>
              <Skeleton className="h-12 w-64 mb-2" />
              <Skeleton className="h-6 w-96" />
            </div>
            <Skeleton className="h-64 rounded-3xl" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-32 rounded-3xl" />
              ))}
            </div>
            <Skeleton className="h-48 rounded-3xl" />
            <Skeleton className="h-96 rounded-3xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!profileData || !profileData.stats) {
    return (
      <div className="min-h-screen bg-background">
        <div className="pt-20 md:pt-24 pb-24 md:pb-8">
          <div className="max-w-7xl mx-auto px-4">
            <Card className="rounded-3xl p-12 text-center">
              <p className="text-lg text-muted-foreground">
                No se pudo cargar el perfil
              </p>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  const { user: userData, stats } = profileData;
  const xpNeededForNextLevel = stats.level * 500;
  const joinedDate = userData.createdAt 
    ? format(new Date(userData.createdAt), "MMMM yyyy", { locale: es })
    : "Recientemente";
  const displayName = [userData.firstName, userData.lastName].filter(Boolean).join(" ") || "Usuario";

  return (
    <div className="min-h-screen bg-background">
      <div className="pt-20 md:pt-24 pb-24 md:pb-8">
        <div className="max-w-7xl mx-auto px-4 space-y-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Mi Perfil</h1>
            <p className="text-muted-foreground text-lg">
              Tu progreso y estadísticas
            </p>
          </div>

          {/* Profile Header */}
          <Card className="rounded-3xl p-8">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="relative">
                <Avatar className="w-32 h-32">
                  <AvatarImage src={userData.profileImageUrl || ""} alt={displayName} />
                  <AvatarFallback className="text-3xl bg-gradient-to-br from-purple-500 to-pink-500 text-white">
                    {displayName.split(" ").map((n) => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-2 -right-2">
                  <LevelIndicator level={stats.level} size="md" />
                </div>
              </div>

              <div className="flex-1 text-center md:text-left space-y-2">
                <h2 className="text-3xl font-bold">{displayName}</h2>
                {userData.email && (
                  <p className="text-muted-foreground">{userData.email}</p>
                )}
                <p className="text-muted-foreground">
                  Miembro desde {joinedDate}
                </p>
                <ProgressBar
                  current={stats.xp}
                  max={xpNeededForNextLevel}
                  label={`Nivel ${stats.level} → Nivel ${stats.level + 1}`}
                  height="lg"
                />
              </div>

              <div className="flex gap-2">
                <Button variant="outline" className="rounded-xl" data-testid="button-settings">
                  <Settings className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </Card>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatsCard
              icon={Star}
              label="Puntos"
              value={stats.points.toLocaleString()}
              iconColor="text-yellow-500"
            />
            <StatsCard
              icon={Trophy}
              label="XP Total"
              value={stats.xp.toLocaleString()}
              iconColor="text-purple-500"
            />
            <StatsCard
              icon={Flame}
              label="Racha"
              value={`${stats.streak} días`}
              iconColor="text-orange-500"
            />
            <StatsCard
              icon={Target}
              label="Nivel"
              value={stats.level}
              iconColor="text-blue-500"
            />
          </div>

          {/* Parent Controls */}
          <Card className="rounded-3xl p-6 bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800">
            <div className="flex items-start gap-4">
              <div className="bg-red-100 dark:bg-red-900/30 p-3 rounded-xl">
                <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold mb-2">Control Parental</h3>
                <p className="text-muted-foreground mb-4">
                  Como padre/tutor, puedes aplicar penalizaciones cuando sea necesario.
                </p>
                <Button
                  onClick={() => setPenaltyModalOpen(true)}
                  className="rounded-xl bg-red-500 hover:bg-red-600"
                  data-testid="button-apply-penalty"
                >
                  Aplicar Penalización
                </Button>
              </div>
            </div>
          </Card>

          {/* Recent Activity */}
          <Card className="rounded-3xl p-6">
            <h2 className="text-2xl font-bold mb-4">Actividad Reciente</h2>
            {activityLog && activityLog.length > 0 ? (
              <div className="space-y-3">
                {activityLog.map((activity, index) => {
                  const bgColors: Record<string, string> = {
                    challenge_completed: "bg-green-100 dark:bg-green-900/30",
                    achievement_unlocked: "bg-purple-100 dark:bg-purple-900/30",
                    penalty_applied: "bg-red-100 dark:bg-red-900/30",
                    reward_redeemed: "bg-blue-100 dark:bg-blue-900/30",
                    question_answered: "bg-yellow-100 dark:bg-yellow-900/30",
                  };
                  const iconColors: Record<string, string> = {
                    challenge_completed: "text-green-600 dark:text-green-400",
                    achievement_unlocked: "text-purple-600 dark:text-purple-400",
                    penalty_applied: "text-red-600 dark:text-red-400",
                    reward_redeemed: "text-blue-600 dark:text-blue-400",
                    question_answered: "text-yellow-600 dark:text-yellow-400",
                  };

                  const getTimeAgo = (date: Date) => {
                    const now = new Date();
                    const diffMs = now.getTime() - new Date(date).getTime();
                    const diffMins = Math.floor(diffMs / 60000);
                    const diffHours = Math.floor(diffMs / 3600000);
                    const diffDays = Math.floor(diffMs / 86400000);

                    if (diffMins < 60) return `Hace ${diffMins} minutos`;
                    if (diffHours < 24) return `Hace ${diffHours} horas`;
                    return `Hace ${diffDays} días`;
                  };

                  return (
                    <div
                      key={activity.id}
                      className="flex items-center gap-4 p-4 bg-muted rounded-2xl"
                      data-testid={`activity-${index}`}
                    >
                      <div className={`w-12 h-12 rounded-xl ${bgColors[activity.type] || "bg-gray-100 dark:bg-gray-900/30"} flex items-center justify-center`}>
                        {activity.type === "challenge_completed" && <Trophy className={`w-6 h-6 ${iconColors[activity.type]}`} />}
                        {activity.type === "achievement_unlocked" && <Target className={`w-6 h-6 ${iconColors[activity.type]}`} />}
                        {activity.type === "penalty_applied" && <AlertCircle className={`w-6 h-6 ${iconColors[activity.type]}`} />}
                        {activity.type === "reward_redeemed" && <Star className={`w-6 h-6 ${iconColors[activity.type]}`} />}
                        {activity.type === "question_answered" && <Trophy className={`w-6 h-6 ${iconColors[activity.type]}`} />}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold">{activity.title}</p>
                        {activity.reason && (
                          <p className="text-sm text-muted-foreground">{activity.reason}</p>
                        )}
                        <p className="text-sm text-muted-foreground">{getTimeAgo(activity.createdAt)}</p>
                      </div>
                      {activity.xp !== 0 && (
                        <span className={`font-bold ${activity.xp > 0 ? "text-yellow-600" : "text-red-600"}`}>
                          {activity.xp > 0 ? "+" : ""}{activity.xp} XP
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-8">
                No hay actividad reciente
              </p>
            )}
          </Card>
        </div>
      </div>

      <PenaltyModal
        open={penaltyModalOpen}
        onOpenChange={setPenaltyModalOpen}
        onApply={handleApplyPenalty}
      />
    </div>
  );
}
