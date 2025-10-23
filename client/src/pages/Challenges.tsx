import { useState } from "react";
import ChallengeCard from "@/components/ChallengeCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import CelebrationModal from "@/components/CelebrationModal";

export default function Challenges() {
  const [selectedCategory, setSelectedCategory] = useState("todos");
  const [celebrationOpen, setCelebrationOpen] = useState(false);
  const [celebrationXP, setCelebrationXP] = useState(0);

  // TODO: Remove mock data - fetch from backend
  const challenges = [
    {
      id: 1,
      title: "¡Contador Estrella! ⭐",
      description: "Cuenta del 1 al 20 sin equivocarte. ¡Puedes usar tus dedos!",
      xpReward: 100,
      category: "aprendizaje",
      difficulty: 1,
      durationDays: 1,
    },
    {
      id: 2,
      title: "Artista Creativo 🎨",
      description: "Dibuja tu animal favorito usando 5 colores diferentes",
      xpReward: 200,
      category: "creatividad",
      difficulty: 2,
      durationDays: 2,
      progress: 65,
    },
    {
      id: 3,
      title: "Atleta del Día 🏃‍♂️",
      description: "Haz 10 saltos de tijera. ¡Cuenta en voz alta!",
      xpReward: 120,
      category: "movimiento",
      difficulty: 1,
      durationDays: 1,
      completed: true,
    },
    {
      id: 4,
      title: "Científico Curioso 🔬",
      description: "Observa una planta durante 5 minutos y dibuja lo que ves",
      xpReward: 180,
      category: "aprendizaje",
      difficulty: 2,
      durationDays: 1,
    },
    {
      id: 5,
      title: "Ayudante del Hogar 🏠",
      description: "Guarda 5 juguetes en su lugar. ¡Ordena tu espacio!",
      xpReward: 110,
      category: "tareas",
      difficulty: 1,
      durationDays: 1,
    },
    {
      id: 6,
      title: "Bailarín Estrella 💃",
      description: "Inventa una coreografía de 30 segundos y preséntala",
      xpReward: 200,
      category: "creatividad",
      difficulty: 3,
      durationDays: 2,
    },
  ];

  const categories = [
    { value: "todos", label: "Todos" },
    { value: "aprendizaje", label: "Aprendizaje" },
    { value: "creatividad", label: "Creatividad" },
    { value: "movimiento", label: "Movimiento" },
    { value: "tareas", label: "Tareas" },
  ];

  const filteredChallenges = selectedCategory === "todos"
    ? challenges
    : challenges.filter((c) => c.category === selectedCategory);

  const handleAccept = (challenge: typeof challenges[0]) => {
    console.log("Challenge accepted:", challenge);
  };

  const handleComplete = (challenge: typeof challenges[0]) => {
    console.log("Challenge completed:", challenge);
    setCelebrationXP(challenge.xpReward);
    setCelebrationOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="pt-20 md:pt-24 pb-24 md:pb-8">
        <div className="max-w-7xl mx-auto px-4 space-y-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Desafíos</h1>
            <p className="text-muted-foreground text-lg">
              ¡Completa desafíos diarios y gana XP!
            </p>
          </div>

          {/* Category Filters */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map((cat) => (
              <Badge
                key={cat.value}
                onClick={() => setSelectedCategory(cat.value)}
                className={`cursor-pointer px-4 py-2 rounded-xl text-sm whitespace-nowrap hover-elevate ${
                  selectedCategory === cat.value
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
                data-testid={`filter-${cat.value}`}
              >
                {cat.label}
              </Badge>
            ))}
          </div>

          {/* Challenges Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredChallenges.map((challenge) => (
              <ChallengeCard
                key={challenge.id}
                {...challenge}
                onAccept={() => handleAccept(challenge)}
                onComplete={() => handleComplete(challenge)}
              />
            ))}
          </div>
        </div>
      </div>

      <CelebrationModal
        open={celebrationOpen}
        onOpenChange={setCelebrationOpen}
        title="¡Desafío Completado!"
        message="¡Excelente trabajo! Sigue así"
        xpEarned={celebrationXP}
      />
    </div>
  );
}
