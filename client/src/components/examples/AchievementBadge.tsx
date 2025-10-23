import AchievementBadge from '../AchievementBadge';

export default function AchievementBadgeExample() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 p-4">
      <AchievementBadge
        title="Primera Estrella ⭐"
        description="¡Completaste tu primer desafío!"
        icon="⭐"
        xpReward={50}
        rarity="común"
        unlocked={true}
      />
      <AchievementBadge
        title="Cerebrito 🧠"
        description="Completaste 5 desafíos de aprendizaje"
        icon="🧠"
        xpReward={150}
        rarity="raro"
        unlocked={true}
      />
      <AchievementBadge
        title="Campeón del Día 🏆"
        description="Completaste 5 desafíos en un solo día"
        icon="🏆"
        xpReward={250}
        rarity="épico"
        unlocked={false}
      />
      <AchievementBadge
        title="Leyenda Dorada 👑"
        description="Alcanzaste el nivel 5"
        icon="👑"
        xpReward={500}
        rarity="legendario"
        unlocked={false}
      />
    </div>
  );
}
