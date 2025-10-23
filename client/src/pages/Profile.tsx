import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import StatsCard from "@/components/StatsCard";
import ProgressBar from "@/components/ProgressBar";
import PenaltyModal from "@/components/PenaltyModal";
import { Star, Trophy, Flame, Target, AlertCircle, Settings } from "lucide-react";
import LevelIndicator from "@/components/LevelIndicator";

export default function Profile() {
  const [penaltyModalOpen, setPenaltyModalOpen] = useState(false);

  // TODO: Remove mock data - fetch from backend
  const userProfile = {
    name: "María García",
    avatar: "",
    level: 5,
    xp: 1250,
    nextLevelXP: 1500,
    totalChallenges: 23,
    totalAchievements: 12,
    streak: 7,
    joinedDate: "Enero 2025",
  };

  const recentActivity: Array<{
    type: "challenge" | "achievement" | "penalty";
    title: string;
    xp: number;
    time: string;
    reason?: string;
  }> = [
    {
      type: "challenge",
      title: "Completaste 'Atleta del Día'",
      xp: 120,
      time: "Hace 2 horas",
    },
    {
      type: "achievement",
      title: "Desbloqueaste 'Primera Estrella'",
      xp: 50,
      time: "Ayer",
    },
    {
      type: "penalty",
      title: "Penalización aplicada",
      xp: -50,
      reason: "No hizo la tarea",
      time: "Hace 3 días",
    },
  ];

  const handleApplyPenalty = (points: number, reason: string) => {
    console.log("Penalty applied:", { points, reason });
  };

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
                  <AvatarImage src={userProfile.avatar} alt={userProfile.name} />
                  <AvatarFallback className="text-3xl bg-gradient-to-br from-purple-500 to-pink-500 text-white">
                    {userProfile.name.split(" ").map((n) => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-2 -right-2">
                  <LevelIndicator level={userProfile.level} size="md" />
                </div>
              </div>

              <div className="flex-1 text-center md:text-left space-y-2">
                <h2 className="text-3xl font-bold">{userProfile.name}</h2>
                <p className="text-muted-foreground">
                  Miembro desde {userProfile.joinedDate}
                </p>
                <ProgressBar
                  current={userProfile.xp}
                  max={userProfile.nextLevelXP}
                  label={`Nivel ${userProfile.level} → Nivel ${userProfile.level + 1}`}
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
              label="Puntos XP"
              value={userProfile.xp.toLocaleString()}
              iconColor="text-yellow-500"
            />
            <StatsCard
              icon={Trophy}
              label="Desafíos"
              value={userProfile.totalChallenges}
              iconColor="text-purple-500"
            />
            <StatsCard
              icon={Flame}
              label="Racha"
              value={`${userProfile.streak} días`}
              iconColor="text-orange-500"
            />
            <StatsCard
              icon={Target}
              label="Logros"
              value={userProfile.totalAchievements}
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
            <div className="space-y-3">
              {recentActivity.map((activity, index) => {
                const bgColors = {
                  challenge: "bg-green-100 dark:bg-green-900/30",
                  achievement: "bg-purple-100 dark:bg-purple-900/30",
                  penalty: "bg-red-100 dark:bg-red-900/30",
                };
                const iconColors = {
                  challenge: "text-green-600 dark:text-green-400",
                  achievement: "text-purple-600 dark:text-purple-400",
                  penalty: "text-red-600 dark:text-red-400",
                };

                return (
                  <div
                    key={index}
                    className="flex items-center gap-4 p-4 bg-muted rounded-2xl"
                    data-testid={`activity-${index}`}
                  >
                    <div className={`w-12 h-12 rounded-xl ${bgColors[activity.type]} flex items-center justify-center`}>
                      {activity.type === "challenge" && <Trophy className={`w-6 h-6 ${iconColors[activity.type]}`} />}
                      {activity.type === "achievement" && <Target className={`w-6 h-6 ${iconColors[activity.type]}`} />}
                      {activity.type === "penalty" && <AlertCircle className={`w-6 h-6 ${iconColors[activity.type]}`} />}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold">{activity.title}</p>
                      {activity.type === "penalty" && activity.reason && (
                        <p className="text-sm text-muted-foreground">Razón: {activity.reason}</p>
                      )}
                      <p className="text-sm text-muted-foreground">{activity.time}</p>
                    </div>
                    <span className={`font-bold ${activity.xp > 0 ? "text-yellow-600" : "text-red-600"}`}>
                      {activity.xp > 0 ? "+" : ""}{activity.xp} XP
                    </span>
                  </div>
                );
              })}
            </div>
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
