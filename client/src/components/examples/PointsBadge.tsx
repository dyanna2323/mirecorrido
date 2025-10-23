import PointsBadge from '../PointsBadge';

export default function PointsBadgeExample() {
  return (
    <div className="flex flex-wrap gap-4 p-4 items-center">
      <PointsBadge points={100} size="sm" />
      <PointsBadge points={1250} size="md" />
      <PointsBadge points={5000} size="lg" />
      <PointsBadge points={250} variant="outline" />
    </div>
  );
}
