import ProgressBar from '../ProgressBar';

export default function ProgressBarExample() {
  return (
    <div className="space-y-6 p-4 max-w-md">
      <ProgressBar
        current={750}
        max={1000}
        label="Nivel 5 → Nivel 6"
        height="lg"
      />
      <ProgressBar
        current={3}
        max={5}
        label="Desafíos completados hoy"
        height="md"
      />
      <ProgressBar
        current={80}
        max={100}
        showPercentage={false}
        height="sm"
      />
    </div>
  );
}
