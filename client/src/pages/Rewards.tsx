import { useState } from "react";
import RewardCard from "@/components/RewardCard";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import PointsBadge from "@/components/PointsBadge";
import { useAuth } from "@/hooks/useAuth";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Reward, UserReward, UserStats } from "@shared/schema";

type UserRewardWithReward = UserReward & { reward: Reward };

export default function Rewards() {
  const [selectedCategory, setSelectedCategory] = useState("todos");
  const { user, isLoading: authLoading } = useAuth();
  const { toast } = useToast();

  const { data: allRewards, isLoading: rewardsLoading } = useQuery<Reward[]>({
    queryKey: ["/api/rewards"],
  });

  const { data: userRewards, isLoading: userRewardsLoading } = useQuery<UserRewardWithReward[]>({
    queryKey: ["/api/me/rewards"],
    enabled: !!user,
  });

  const { data: meData } = useQuery<{ user: any; stats: UserStats }>({
    queryKey: ["/api/me"],
    enabled: !!user,
  });

  const isLoading = authLoading || rewardsLoading || userRewardsLoading;
  const currentPoints = meData?.stats.points || 0;

  const redeemRewardMutation = useMutation({
    mutationFn: async (rewardId: string) => {
      const res = await apiRequest("POST", `/api/me/rewards/${rewardId}/redeem`, {});
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/me/rewards"] });
      queryClient.invalidateQueries({ queryKey: ["/api/me"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard"] });
      toast({
        title: "¡Premio Canjeado!",
        description: "¡Disfruta tu premio!",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "No se pudo canjear el premio",
        variant: "destructive",
      });
    },
  });

  const categories = [
    { value: "todos", label: "Todos" },
    { value: "premios", label: "Premios" },
    { value: "salidas", label: "Salidas" },
    { value: "tiempo_libre", label: "Tiempo Libre" },
    { value: "juegos", label: "Juegos" },
    { value: "especiales", label: "Especiales" },
  ];

  const filteredRewards = selectedCategory === "todos"
    ? (allRewards || [])
    : (allRewards || []).filter((r) => r.category === selectedCategory);

  const handleRedeem = (reward: Reward) => {
    if (currentPoints >= reward.pointsRequired) {
      redeemRewardMutation.mutate(reward.id);
    } else {
      toast({
        title: "Puntos Insuficientes",
        description: `Necesitas ${reward.pointsRequired - currentPoints} puntos más`,
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="pt-20 md:pt-24 pb-24 md:pb-8">
          <div className="max-w-7xl mx-auto px-4 space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <Skeleton className="h-12 w-64 mb-2" />
                <Skeleton className="h-6 w-96" />
              </div>
              <Skeleton className="h-12 w-32" />
            </div>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5, 6].map((i) => (
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
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">Tienda de Premios</h1>
              <p className="text-muted-foreground text-lg">
                ¡Canjea tus puntos por increíbles premios!
              </p>
            </div>
            <PointsBadge points={currentPoints} size="lg" />
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

          {/* Rewards Grid */}
          {filteredRewards.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRewards.map((reward) => (
                <RewardCard
                  key={reward.id}
                  title={reward.title}
                  description={reward.description}
                  pointsRequired={reward.pointsRequired}
                  category={reward.category}
                  currentPoints={currentPoints}
                  onRedeem={() => handleRedeem(reward)}
                />
              ))}
            </div>
          ) : (
            <Card className="rounded-3xl p-12 text-center">
              <p className="text-lg text-muted-foreground">
                No hay premios en esta categoría
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
