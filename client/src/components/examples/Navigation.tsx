import Navigation from '../Navigation';

export default function NavigationExample() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation userPoints={1250} userLevel={5} />
      <div className="pt-20 md:pt-24 pb-24 md:pb-8 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold mb-4">Contenido de la página</h2>
          <p className="text-muted-foreground">
            La navegación se muestra arriba (escritorio) y abajo (móvil)
          </p>
        </div>
      </div>
    </div>
  );
}
