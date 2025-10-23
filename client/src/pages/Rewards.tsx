import { useState } from "react";
import RewardCard from "@/components/RewardCard";
import { Badge } from "@/components/ui/badge";
import PointsBadge from "@/components/PointsBadge";

export default function Rewards() {
  const [selectedCategory, setSelectedCategory] = useState("todos");
  
  // TODO: Remove mock data - fetch from backend
  const currentPoints = 1250;

  const rewards = [
    {
      id: 1,
      title: "Helado Especial 🍦",
      description: "Elige tu helado favorito con todos los toppings",
      pointsRequired: 250,
      category: "premios",
    },
    {
      id: 2,
      title: "30 Minutos de Videojuegos 🎮",
      description: "Disfruta media hora adicional jugando tu juego favorito",
      pointsRequired: 500,
      category: "juegos",
    },
    {
      id: 3,
      title: "Noche de Película 🎬",
      description: "Elige una película y palomitas para toda la familia",
      pointsRequired: 700,
      category: "tiempo_libre",
    },
    {
      id: 4,
      title: "Libro Nuevo 📚",
      description: "¡Elige un libro nuevo en la librería!",
      pointsRequired: 1100,
      category: "premios",
    },
    {
      id: 5,
      title: "Día de Parque 🎡",
      description: "¡Vamos al parque o área de juegos este fin de semana!",
      pointsRequired: 1200,
      category: "salidas",
    },
    {
      id: 6,
      title: "Nuevo Juguete Pequeño 🧸",
      description: "¡Visita la tienda y elige un juguete pequeño!",
      pointsRequired: 1500,
      category: "premios",
    },
    {
      id: 7,
      title: "Ir al Parque",
      description: "Una tarde divertida en el parque de diversiones",
      pointsRequired: 2000,
      category: "salidas",
    },
    {
      id: 8,
      title: "Clase de lo que Quieras 🎨",
      description: "Una clase de arte, música, deporte o lo que elijas",
      pointsRequired: 2000,
      category: "especiales",
    },
  ];

  const categories = [
    { value: "todos", label: "Todos" },
    { value: "premios", label: "Premios" },
    { value: "salidas", label: "Salidas" },
    { value: "tiempo_libre", label: "Tiempo Libre" },
    { value: "juegos", label: "Juegos" },
    { value: "especiales", label: "Especiales" },
  ];

  const filteredRewards = selectedCategory === "todos"
    ? rewards
    : rewards.filter((r) => r.category === selectedCategory);

  const handleRedeem = (reward: typeof rewards[0]) => {
    if (currentPoints >= reward.pointsRequired) {
      console.log("Reward redeemed:", reward);
    }
  };

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
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRewards.map((reward) => (
              <RewardCard
                key={reward.id}
                {...reward}
                currentPoints={currentPoints}
                onRedeem={() => handleRedeem(reward)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
