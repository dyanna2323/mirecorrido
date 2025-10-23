import LevelIndicator from '../LevelIndicator';

export default function LevelIndicatorExample() {
  return (
    <div className="flex gap-6 p-4 items-center">
      <LevelIndicator level={5} size="sm" />
      <LevelIndicator level={12} size="md" />
      <LevelIndicator level={25} size="lg" />
    </div>
  );
}
