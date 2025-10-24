import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Rocket, Star, Trophy, Sparkles } from "lucide-react";

export default function Landing() {
  const handleLogin = () => {
    window.location.href = "/api/login";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-400 to-blue-400 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Rocket className="h-12 w-12 text-white" />
            <h1 className="text-5xl font-bold text-white" style={{ fontFamily: "Fredoka, sans-serif" }}>
              Mi Recorrido
            </h1>
            <Star className="h-12 w-12 text-yellow-300" />
          </div>
          <p className="text-white text-lg" style={{ fontFamily: "Nunito, sans-serif" }}>
            ¡Aprende y diviértete ganando puntos!
          </p>
        </div>

        <Card className="shadow-2xl">
          <CardHeader>
            <div className="flex items-center justify-center gap-2 mb-2">
              <Trophy className="h-6 w-6 text-yellow-500" />
              <CardTitle style={{ fontFamily: "Fredoka, sans-serif" }}>¡Comienza tu aventura!</CardTitle>
            </div>
            <CardDescription style={{ fontFamily: "Nunito, sans-serif" }}>
              Inicia sesión para comenzar a aprender
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              onClick={handleLogin}
              data-testid="button-login"
              className="w-full h-14 text-lg font-bold"
              style={{ fontFamily: "Fredoka, sans-serif" }}
            >
              <Sparkles className="mr-2 h-5 w-5" />
              Iniciar Sesión
            </Button>
            
            <div className="text-center text-sm text-muted-foreground" style={{ fontFamily: "Nunito, sans-serif" }}>
              <p>Puedes iniciar sesión con:</p>
              <p className="mt-1">Google • GitHub • X (Twitter) • Apple • Email</p>
            </div>
          </CardContent>
        </Card>
        
        <div className="mt-8 grid grid-cols-3 gap-4 text-center text-white">
          <div>
            <div className="text-3xl font-bold mb-1" style={{ fontFamily: "Fredoka, sans-serif" }}>10+</div>
            <div className="text-sm" style={{ fontFamily: "Nunito, sans-serif" }}>Desafíos</div>
          </div>
          <div>
            <div className="text-3xl font-bold mb-1" style={{ fontFamily: "Fredoka, sans-serif" }}>30+</div>
            <div className="text-sm" style={{ fontFamily: "Nunito, sans-serif" }}>Preguntas</div>
          </div>
          <div>
            <div className="text-3xl font-bold mb-1" style={{ fontFamily: "Fredoka, sans-serif" }}>12+</div>
            <div className="text-sm" style={{ fontFamily: "Nunito, sans-serif" }}>Logros</div>
          </div>
        </div>
      </div>
    </div>
  );
}
