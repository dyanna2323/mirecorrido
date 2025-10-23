import RewardCard from '../RewardCard';

export default function RewardCardExample() {
  const currentPoints = 600;

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
      <RewardCard
        title="Helado Especial 🍦"
        description="Elige tu helado favorito con todos los toppings"
        pointsRequired={250}
        category="premios"
        currentPoints={currentPoints}
        onRedeem={() => console.log('Reward redeemed')}
      />
      <RewardCard
        title="30 Minutos de Videojuegos 🎮"
        description="Disfruta media hora adicional jugando tu juego favorito"
        pointsRequired={500}
        category="juegos"
        currentPoints={currentPoints}
        onRedeem={() => console.log('Reward redeemed')}
      />
      <RewardCard
        title="Ir al Parque"
        description="Una tarde divertida en el parque de diversiones"
        pointsRequired={2000}
        category="salidas"
        currentPoints={currentPoints}
        onRedeem={() => console.log('Reward redeemed')}
      />
    </div>
  );
}
