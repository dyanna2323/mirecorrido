import StatsCard from '../StatsCard';
import { Star, Trophy, Flame, Target } from 'lucide-react';

export default function StatsCardExample() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4">
      <StatsCard
        icon={Star}
        label="Puntos XP"
        value="1,250"
        iconColor="text-yellow-500"
        trend="+50 hoy"
      />
      <StatsCard
        icon={Trophy}
        label="Desafíos"
        value="23"
        iconColor="text-purple-500"
        trend="5 activos"
      />
      <StatsCard
        icon={Flame}
        label="Racha"
        value="7 días"
        iconColor="text-orange-500"
      />
      <StatsCard
        icon={Target}
        label="Logros"
        value="12"
        iconColor="text-blue-500"
      />
    </div>
  );
}
