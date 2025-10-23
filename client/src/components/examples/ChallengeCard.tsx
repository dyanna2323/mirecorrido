import ChallengeCard from '../ChallengeCard';

export default function ChallengeCardExample() {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
      <ChallengeCard
        title="¡Contador Estrella! ⭐"
        description="Cuenta del 1 al 20 sin equivocarte. ¡Puedes usar tus dedos!"
        xpReward={100}
        category="aprendizaje"
        difficulty={1}
        durationDays={1}
        onAccept={() => console.log('Challenge accepted')}
      />
      <ChallengeCard
        title="Artista Creativo 🎨"
        description="Dibuja tu animal favorito usando 5 colores diferentes"
        xpReward={200}
        category="creatividad"
        difficulty={2}
        durationDays={2}
        progress={65}
        onComplete={() => console.log('Challenge completed')}
      />
      <ChallengeCard
        title="Atleta del Día 🏃‍♂️"
        description="Haz 10 saltos de tijera. ¡Cuenta en voz alta!"
        xpReward={120}
        category="movimiento"
        difficulty={1}
        durationDays={1}
        completed={true}
      />
    </div>
  );
}
