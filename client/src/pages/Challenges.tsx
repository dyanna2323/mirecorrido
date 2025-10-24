import { useState } from "react";
import ChallengeCard from "@/components/ChallengeCard";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import CelebrationModal from "@/components/CelebrationModal";
import { useAuth } from "@/hooks/useAuth";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Challenge, UserChallenge, UserStats } from "@shared/schema";

type UserChallengeWithChallenge = UserChallenge & { challenge: Challenge };

type ChallengeWithUserData = Challenge & {
  userChallenge?: UserChallenge;
  completed?: boolean;
  progress?: number;
};

export default function Challenges() {
  const [selectedCategory, setSelectedCategory] = useState("todos");
  const [celebrationOpen, setCelebrationOpen] = useState(false);
  const [celebrationXP, setCelebrationXP] = useState(0);
  const { user, isLoading: authLoading } = useAuth();
  const { toast } = useToast();

  const { data: allChallenges, isLoading: challengesLoading } = useQuery<Challenge[]>({
    queryKey: ["/api/challenges"],
  });

  const { data: userChallenges, isLoading: userChallengesLoading } = useQuery<UserChallengeWithChallenge[]>({
    queryKey: ["/api/me/challenges"],
    enabled: !!user,
  });

  const isLoading = authLoading || challengesLoading || userChallengesLoading;

  const startChallengeMutation = useMutation({
    mutationFn: async (challengeId: string) => {
      const res = await apiRequest("POST", `/api/me/challenges/${challengeId}/start`, {});
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/me/challenges"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard"] });
      toast({
        title: "¡Desafío Iniciado!",
        description: "¡Buena suerte! Puedes hacerlo",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "No se pudo iniciar el desafío",
        variant: "destructive",
      });
    },
  });

  const completeChallengeMutation = useMutation({
    mutationFn: async (userChallengeId: string) => {
      const res = await apiRequest("PATCH", `/api/me/challenges/${userChallengeId}/complete`, {});
      return res.json();
    },
    onSuccess: (data: { stats: UserStats }) => {
      queryClient.invalidateQueries({ queryKey: ["/api/me/challenges"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["/api/me"] });
      setCelebrationOpen(true);
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "No se pudo completar el desafío",
        variant: "destructive",
      });
    },
  });

  const categories = [
    { value: "todos", label: "Todos" },
    { value: "aprendizaje", label: "Aprendizaje" },
    { value: "creatividad", label: "Creatividad" },
    { value: "movimiento", label: "Movimiento" },
    { value: "tareas", label: "Tareas" },
  ];

  const mergedChallenges: ChallengeWithUserData[] = (allChallenges || []).map((challenge) => {
    const userChallenge = (userChallenges || []).find(
      (uc) => uc.challengeId === challenge.id
    );

    return {
      ...challenge,
      userChallenge,
      completed: userChallenge?.completed || false,
      progress: userChallenge && !userChallenge.completed ? userChallenge.progress : undefined,
    };
  });

  const filteredChallenges = selectedCategory === "todos"
    ? mergedChallenges
    : mergedChallenges.filter((c) => c.category === selectedCategory);

  const handleAccept = (challenge: ChallengeWithUserData) => {
    startChallengeMutation.mutate(challenge.id);
  };

  const handleComplete = (challenge: ChallengeWithUserData) => {
    if (challenge.userChallenge) {
      setCelebrationXP(challenge.xpReward);
      completeChallengeMutation.mutate(challenge.userChallenge.id);
    }
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
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-10 w-24 rounded-xl" />
              ))}
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Skeleton key={i} className="h-64 rounded-3xl" />
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
          {filteredChallenges.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredChallenges.map((challenge) => (
                <ChallengeCard
                  key={challenge.id}
                  title={challenge.title}
                  description={challenge.description}
                  xpReward={challenge.xpReward}
                  category={challenge.category}
                  difficulty={challenge.difficulty}
                  durationDays={challenge.durationDays}
                  completed={challenge.completed}
                  progress={challenge.progress}
                  onAccept={() => handleAccept(challenge)}
                  onComplete={() => handleComplete(challenge)}
                />
              ))}
            </div>
          ) : (
            <Card className="rounded-3xl p-12 text-center">
              <p className="text-lg text-muted-foreground">
                No hay desafíos en esta categoría
              </p>
            </Card>
          )}
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
