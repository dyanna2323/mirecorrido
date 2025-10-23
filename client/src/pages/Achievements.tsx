import AchievementBadge from "@/components/AchievementBadge";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

export default function Achievements() {
  const [selectedRarity, setSelectedRarity] = useState("todos");

  // TODO: Remove mock data - fetch from backend
  const achievements = [
    {
      id: 1,
      title: "Primera Estrella ⭐",
      description: "¡Completaste tu primer desafío! Eres increíble",
      icon: "⭐",
      xpReward: 50,
      rarity: "común",
      unlocked: true,
    },
    {
      id: 2,
      title: "Organizador Pro 📋",
      description: "Completaste 3 tareas de orden",
      icon: "📋",
      xpReward: 100,
      rarity: "común",
      unlocked: true,
    },
    {
      id: 3,
      title: "Cerebrito 🧠",
      description: "Completaste 5 desafíos de aprendizaje",
      icon: "🧠",
      xpReward: 150,
      rarity: "raro",
      unlocked: true,
    },
    {
      id: 4,
      title: "Artista Genial 🎨",
      description: "Completaste 3 desafíos creativos",
      icon: "🎨",
      xpReward: 120,
      rarity: "raro",
      unlocked: true,
    },
    {
      id: 5,
      title: "Atleta Súper 💪",
      description: "Completaste 5 desafíos de ejercicio",
      icon: "💪",
      xpReward: 130,
      rarity: "raro",
      unlocked: false,
    },
    {
      id: 6,
      title: "Racha de Fuego 🔥",
      description: "Completaste desafíos 3 días seguidos",
      icon: "🔥",
      xpReward: 200,
      rarity: "épico",
      unlocked: false,
    },
    {
      id: 7,
      title: "Campeón del Día 🏆",
      description: "Completaste 5 desafíos en un solo día",
      icon: "🏆",
      xpReward: 250,
      rarity: "épico",
      unlocked: false,
    },
    {
      id: 8,
      title: "Maestro de la Concentración 🎯",
      description: "Completaste 3 desafíos difíciles sin ayuda",
      icon: "🎯",
      xpReward: 220,
      rarity: "épico",
      unlocked: false,
    },
    {
      id: 9,
      title: "Explorador Curioso 🔍",
      description: "Probaste desafíos de todas las categorías",
      icon: "🔍",
      xpReward: 180,
      rarity: "raro",
      unlocked: false,
    },
    {
      id: 10,
      title: "Leyenda Dorada 👑",
      description: "Alcanzaste el nivel 5. ¡Eres una superestrella!",
      icon: "👑",
      xpReward: 500,
      rarity: "legendario",
      unlocked: false,
    },
  ];

  const rarities = [
    { value: "todos", label: "Todos" },
    { value: "común", label: "Común" },
    { value: "raro", label: "Raro" },
    { value: "épico", label: "Épico" },
    { value: "legendario", label: "Legendario" },
  ];

  const filteredAchievements = selectedRarity === "todos"
    ? achievements
    : achievements.filter((a) => a.rarity === selectedRarity);

  const unlockedCount = achievements.filter((a) => a.unlocked).length;

  return (
    <div className="min-h-screen bg-background">
      <div className="pt-20 md:pt-24 pb-24 md:pb-8">
        <div className="max-w-7xl mx-auto px-4 space-y-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Mis Logros</h1>
            <p className="text-muted-foreground text-lg">
              Has desbloqueado {unlockedCount} de {achievements.length} logros
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
              <AchievementBadge key={achievement.id} {...achievement} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
