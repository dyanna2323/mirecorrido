import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, CheckCircle2, Clock } from "lucide-react";
import ProgressBar from "./ProgressBar";

interface ChallengeCardProps {
  title: string;
  description: string;
  xpReward: number;
  category: string;
  difficulty: number;
  durationDays: number;
  completed?: boolean;
  progress?: number;
  onAccept?: () => void;
  onComplete?: () => void;
}

export default function ChallengeCard({
  title,
  description,
  xpReward,
  category,
  difficulty,
  durationDays,
  completed = false,
  progress,
  onAccept,
  onComplete,
}: ChallengeCardProps) {
  const categoryColors: Record<string, string> = {
    aprendizaje: "bg-blue-100 text-blue-700",
    creatividad: "bg-purple-100 text-purple-700",
    movimiento: "bg-green-100 text-green-700",
    tareas: "bg-orange-100 text-orange-700",
    learning: "bg-blue-100 text-blue-700",
    creative: "bg-purple-100 text-purple-700",
    fitness: "bg-green-100 text-green-700",
    productivity: "bg-orange-100 text-orange-700",
  };

  const difficultyStars = Array.from({ length: difficulty }, (_, i) => i);

  return (
    <Card
      className={`rounded-3xl p-6 hover-elevate transition-all duration-300 ${
        completed ? "opacity-75" : ""
      }`}
      data-testid={`challenge-card-${title.toLowerCase().replace(/\s+/g, '-')}`}
    >
      {completed && (
        <div className="absolute top-4 right-4 bg-green-500 rounded-full p-2">
          <CheckCircle2 className="w-6 h-6 text-white" />
        </div>
      )}
      
      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-xl font-bold leading-tight">{title}</h3>
            {!completed && (
              <div className="flex gap-1">
                {difficultyStars.map((i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
            )}
          </div>
          <p className="text-muted-foreground leading-relaxed">{description}</p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Badge className={`${categoryColors[category] || "bg-gray-100 text-gray-700"} rounded-lg`}>
            {category}
          </Badge>
          <Badge variant="outline" className="rounded-lg gap-1">
            <Clock className="w-3 h-3" />
            {durationDays} {durationDays === 1 ? "día" : "días"}
          </Badge>
        </div>

        {progress !== undefined && !completed && (
          <ProgressBar current={progress} max={100} label="Progreso" height="md" />
        )}

        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-2 bg-yellow-100 rounded-xl px-3 py-2">
            <Star className="w-5 h-5 fill-yellow-500 text-yellow-500" />
            <span className="font-bold text-yellow-900">+{xpReward} XP</span>
          </div>

          {!completed && (
            <Button
              onClick={progress !== undefined ? onComplete : onAccept}
              className="rounded-xl"
              data-testid="button-challenge-action"
            >
              {progress !== undefined ? "Completar" : "Aceptar"}
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}
