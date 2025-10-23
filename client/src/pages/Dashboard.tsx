import { useState } from "react";
import { useLocation } from "wouter";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import StatsCard from "@/components/StatsCard";
import ProgressBar from "@/components/ProgressBar";
import { Star, Trophy, Flame, Target, Brain, Gift, Award, Zap } from "lucide-react";
import mascotImage from "@assets/generated_images/Educational_owl_mascot_character_1e005c1f.png";
import rocketImage from "@assets/generated_images/Progress_rocket_illustration_d97af20b.png";

export default function Dashboard() {
  const [, navigate] = useLocation();
  
  // TODO: Remove mock data - fetch from backend
  const userStats = {
    name: "María",
    points: 1250,
    level: 5,
    nextLevelXP: 1500,
    streak: 7,
    challengesCompleted: 23,
    achievementsUnlocked: 12,
  };

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

  return (
    <div className="min-h-screen bg-background">
      <div className="pt-20 md:pt-24 pb-24 md:pb-8">
        <div className="max-w-7xl mx-auto px-4 space-y-8">
          {/* Welcome Hero */}
          <Card className="rounded-3xl p-8 bg-gradient-to-br from-purple-500 to-pink-500 text-white overflow-hidden relative">
            <div className="relative z-10 space-y-4">
              <div className="flex items-center gap-4">
                <img src={mascotImage} alt="Mascot" className="w-20 h-20 rounded-full bg-white/20 p-2" />
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold">
                    ¡Hola, {userStats.name}! 👋
                  </h1>
                  <p className="text-lg md:text-xl opacity-90">
                    ¡Estás haciendo un trabajo increíble!
                  </p>
                </div>
              </div>

              <div className="bg-white/20 backdrop-blur rounded-2xl p-6">
                <ProgressBar
                  current={userStats.points}
                  max={userStats.nextLevelXP}
                  label={`Nivel ${userStats.level} → Nivel ${userStats.level + 1}`}
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
              value={userStats.points.toLocaleString()}
              iconColor="text-yellow-500"
              trend={`+${Math.floor(userStats.points * 0.1)} hoy`}
            />
            <StatsCard
              icon={Trophy}
              label="Desafíos"
              value={userStats.challengesCompleted}
              iconColor="text-purple-500"
              trend="5 activos"
            />
            <StatsCard
              icon={Flame}
              label="Racha"
              value={`${userStats.streak} días`}
              iconColor="text-orange-500"
            />
            <StatsCard
              icon={Target}
              label="Logros"
              value={userStats.achievementsUnlocked}
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
            <div className="space-y-3">
              {/* TODO: Remove mock data - fetch from backend */}
              <div className="flex items-center gap-4 p-4 bg-muted rounded-2xl">
                <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                  <Trophy className="w-6 h-6 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold">Completaste "Atleta del Día"</p>
                  <p className="text-sm text-muted-foreground">Hace 2 horas</p>
                </div>
                <span className="text-yellow-600 font-bold">+120 XP</span>
              </div>
              <div className="flex items-center gap-4 p-4 bg-muted rounded-2xl">
                <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
                  <Award className="w-6 h-6 text-purple-600" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold">Desbloqueaste "Primera Estrella"</p>
                  <p className="text-sm text-muted-foreground">Ayer</p>
                </div>
                <span className="text-yellow-600 font-bold">+50 XP</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
