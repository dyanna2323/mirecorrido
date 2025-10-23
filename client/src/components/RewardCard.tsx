import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Lock } from "lucide-react";

interface RewardCardProps {
  title: string;
  description: string;
  pointsRequired: number;
  category: string;
  imageUrl?: string;
  currentPoints: number;
  onRedeem?: () => void;
}

export default function RewardCard({
  title,
  description,
  pointsRequired,
  category,
  imageUrl,
  currentPoints,
  onRedeem,
}: RewardCardProps) {
  const canAfford = currentPoints >= pointsRequired;
  
  const categoryColors: Record<string, string> = {
    premios: "bg-pink-100 text-pink-700",
    salidas: "bg-blue-100 text-blue-700",
    tiempo_libre: "bg-purple-100 text-purple-700",
    juegos: "bg-green-100 text-green-700",
    especiales: "bg-yellow-100 text-yellow-700",
  };

  return (
    <Card
      className={`rounded-3xl overflow-hidden hover-elevate transition-all duration-300 ${
        canAfford ? "ring-2 ring-yellow-400 shadow-lg" : ""
      }`}
      data-testid={`reward-card-${title.toLowerCase().replace(/\s+/g, '-')}`}
    >
      <div className="relative aspect-square bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
        {imageUrl ? (
          <img src={imageUrl} alt={title} className="w-full h-full object-cover" />
        ) : (
          <span className="text-6xl">🎁</span>
        )}
        {!canAfford && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <Lock className="w-12 h-12 text-white" />
          </div>
        )}
      </div>

      <div className="p-4 space-y-3">
        <div className="space-y-2">
          <h3 className="text-lg font-bold leading-tight">{title}</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
        </div>

        <Badge className={`${categoryColors[category] || "bg-gray-100 text-gray-700"} rounded-lg`}>
          {category}
        </Badge>

        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-1.5 bg-yellow-100 rounded-xl px-3 py-2">
            <Star className="w-5 h-5 fill-yellow-500 text-yellow-500" />
            <span className="font-bold text-yellow-900">{pointsRequired}</span>
          </div>

          <Button
            onClick={onRedeem}
            disabled={!canAfford}
            className="rounded-xl"
            data-testid="button-redeem"
          >
            {canAfford ? "Canjear" : "Bloqueado"}
          </Button>
        </div>
      </div>
    </Card>
  );
}
