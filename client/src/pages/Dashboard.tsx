import { useLocation } from "wouter";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import StatsCard from "@/components/StatsCard";
import ProgressBar from "@/components/ProgressBar";
import { Star, Trophy, Flame, Target, Brain, Gift, Award, Zap } from "lucide-react";
import mascotImage from "@assets/generated_images/Educational_owl_mascot_character_1e005c1f.png";
import rocketImage from "@assets/generated_images/Progress_rocket_illustration_d97af20b.png";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import type { UserStats, UserChallenge, UserAchievement, Challenge, Achievement } from "@shared/schema";

type DashboardData = {
  stats: UserStats;
  activeChallenges: (UserChallenge & { challenge: Challenge })[];
  recentAchievements: (UserAchievement & { achievement: Achievement })[];
};

export default function Dashboard() {
  const [, navigate] = useLocation();
  const { user, isLoading: authLoading } = useAuth();

  const { data: dashboardData, isLoading: dashboardLoading } = useQuery<DashboardData>({
    queryKey: ["/api/dashboard"],
    enabled: !!user,
  });

  const isLoading = authLoading || dashboardLoading;

  const quickActions = [
    {
      title: "Responder Preguntas",
      icon: Brain,
      color: "from-blue-500 to-blue-600",
      path: "/questions",
    },
    {
      title: "Ver Desafíos",
      icon: Trophy,
      color: "from-purple-500 to-purple-600",
      path: "/challenges",
    },
    {
      title: "Tienda de Premios",
      icon: Gift,
      color: "from-pink-500 to-pink-600",
      path: "/rewards",
    },
    {
      title: "Mis Logros",
      icon: Award,
      color: "from-yellow-500 to-yellow-600",
      path: "/achievements",
    },
  ];

  const nextLevelXP = dashboardData?.stats ? (dashboardData.stats.level + 1) * 300 : 300;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="pt-20 md:pt-24 pb-24 md:pb-8">
          <div className="max-w-7xl mx-auto px-4 space-y-8">
            <Skeleton className="h-64 rounded-3xl" data-testid="skeleton-welcome" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Skeleton className="h-32 rounded-3xl" />
              <Skeleton className="h-32 rounded-3xl" />
              <Skeleton className="h-32 rounded-3xl" />
              <Skeleton className="h-32 rounded-3xl" />
            </div>
            <Skeleton className="h-96 rounded-3xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!dashboardData?.stats) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="rounded-3xl p-8 text-center" data-testid="card-error">
          <p className="text-lg text-muted-foreground">No se pudieron cargar los datos del dashboard</p>
        </Card>
      </div>
    );
  }

  const stats = dashboardData.stats;

  return (
    <div className="min-h-screen bg-background">
      <div className="pt-20 md:pt-24 pb-24 md:pb-8">
        <div className="max-w-7xl mx-auto px-4 space-y-8">
          {/* Welcome Hero */}
          <Card className="rounded-3xl p-8 bg-gradient-to-br from-purple-500 to-pink-500 text-white overflow-hidden relative" data-testid="card-welcome">
            <div className="relative z-10 space-y-4">
              <div className="flex items-center gap-4">
                <img src={mascotImage} alt="Mascot" className="w-20 h-20 rounded-full bg-white/20 p-2" />
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold" data-testid="text-welcome">
                    ¡Hola, {user?.name}! 👋
                  </h1>
                  <p className="text-lg md:text-xl opacity-90">
                    ¡Estás haciendo un trabajo increíble!
                  </p>
                </div>
              </div>

              <div className="bg-white/20 backdrop-blur rounded-2xl p-6">
                <ProgressBar
                  current={stats.xp}
                  max={nextLevelXP}
                  label={`Nivel ${stats.level} → Nivel ${stats.level + 1}`}
                  height="lg"
                />
              </div>
            </div>
            <img
              src={rocketImage}
              alt="Rocket"
              className="absolute -right-8 -bottom-8 w-48 h-48 opacity-20"
            />
          </Card>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatsCard
              icon={Star}
              label="Puntos XP"
              value={stats.points.toLocaleString()}
              iconColor="text-yellow-500"
              trend={`Nivel ${stats.level}`}
            />
            <StatsCard
              icon={Trophy}
              label="Desafíos"
              value={dashboardData.activeChallenges.length}
              iconColor="text-purple-500"
              trend={`${dashboardData.activeChallenges.length} activos`}
            />
            <StatsCard
              icon={Flame}
              label="Racha"
              value={`${stats.streak} días`}
              iconColor="text-orange-500"
            />
            <StatsCard
              icon={Target}
              label="Logros"
              value={dashboardData.recentAchievements.length}
              iconColor="text-blue-500"
            />
          </div>

          {/* Quick Actions */}
          <div>
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Zap className="w-6 h-6 text-yellow-500" />
              Acciones Rápidas
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {quickActions.map((action) => {
                const Icon = action.icon;
                return (
                  <Card
                    key={action.title}
                    className="rounded-3xl p-6 hover-elevate active-elevate-2 transition-all duration-300 cursor-pointer"
                    onClick={() => navigate(action.path)}
                    data-testid={`quick-action-${action.title.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    <div className="space-y-4">
                      <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${action.color} flex items-center justify-center`}>
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="font-bold text-lg">{action.title}</h3>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Recent Activity */}
          <Card className="rounded-3xl p-6">
            <h2 className="text-2xl font-bold mb-4">Actividad Reciente</h2>
            {dashboardData.recentAchievements.length > 0 ? (
              <div className="space-y-3">
                {dashboardData.recentAchievements.map((userAchievement) => (
                  <div
                    key={userAchievement.id}
                    className="flex items-center gap-4 p-4 bg-muted rounded-2xl"
                    data-testid={`activity-achievement-${userAchievement.id}`}
                  >
                    <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                      <Award className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold">Desbloqueaste "{userAchievement.achievement.title}"</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(userAchievement.unlockedAt).toLocaleDateString('es-ES')}
                      </p>
                    </div>
                    <span className="text-yellow-600 dark:text-yellow-500 font-bold">+{userAchievement.achievement.xpReward} XP</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-8" data-testid="text-no-activity">
                ¡Completa desafíos para ver tu actividad aquí!
              </p>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
