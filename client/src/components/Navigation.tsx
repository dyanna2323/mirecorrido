import { Link, useLocation } from "wouter";
import { Home, Trophy, Gift, Award, User } from "lucide-react";
import PointsBadge from "./PointsBadge";
import LevelIndicator from "./LevelIndicator";

interface NavigationProps {
  userPoints?: number;
  userLevel?: number;
}

export default function Navigation({ userPoints = 1250, userLevel = 5 }: NavigationProps) {
  const [location] = useLocation();

  const navItems = [
    { path: "/", icon: Home, label: "Inicio" },
    { path: "/challenges", icon: Trophy, label: "Desafíos" },
    { path: "/rewards", icon: Gift, label: "Premios" },
    { path: "/achievements", icon: Award, label: "Logros" },
    { path: "/profile", icon: User, label: "Perfil" },
  ];

  return (
    <>
      {/* Top Navigation - Desktop */}
      <nav className="hidden md:flex fixed top-0 left-0 right-0 h-20 bg-card border-b border-border z-50 px-6">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              MiRecorrido
            </h1>
          </div>

          <div className="flex items-center gap-6">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location === item.path;
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all hover-elevate ${
                    isActive ? "bg-primary text-primary-foreground" : ""
                  }`}
                  data-testid={`nav-${item.label.toLowerCase()}`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-semibold">{item.label}</span>
                </Link>
              );
            })}
          </div>

          <div className="flex items-center gap-4">
            <PointsBadge points={userPoints} size="md" />
            <LevelIndicator level={userLevel} size="md" />
          </div>
        </div>
      </nav>

      {/* Bottom Navigation - Mobile */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-20 bg-card border-t border-border z-50 safe-area-bottom">
        <div className="h-full flex items-center justify-around px-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location === item.path;
            return (
              <Link
                key={item.path}
                href={item.path}
                className={`flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all active-elevate-2 ${
                  isActive ? "text-primary" : "text-muted-foreground"
                }`}
                data-testid={`nav-mobile-${item.label.toLowerCase()}`}
              >
                <Icon className={`w-6 h-6 ${isActive ? "scale-110" : ""}`} />
                <span className="text-xs font-semibold">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Top bar for mobile - shows points and level */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-card border-b border-border z-50 px-4">
        <div className="h-full flex items-center justify-between">
          <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            MiRecorrido
          </h1>
          <div className="flex items-center gap-3">
            <PointsBadge points={userPoints} size="sm" />
            <LevelIndicator level={userLevel} size="sm" />
          </div>
        </div>
      </div>
    </>
  );
}
