import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import Navigation from "@/components/Navigation";
import Dashboard from "@/pages/Dashboard";
import Challenges from "@/pages/Challenges";
import Rewards from "@/pages/Rewards";
import Achievements from "@/pages/Achievements";
import Profile from "@/pages/Profile";
import Questions from "@/pages/Questions";
import AIAssistant from "@/pages/AIAssistant";
import Landing from "@/pages/Landing";
import NotFound from "@/pages/not-found";

function Router() {
  const { user, isLoading, isAuthenticated } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-400 via-pink-400 to-blue-400">
        <div className="text-white text-2xl font-bold" style={{ fontFamily: "Fredoka, sans-serif" }}>
          Cargando...
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Landing />;
  }

  return (
    <>
      <Navigation userPoints={1250} userLevel={5} />
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/challenges" component={Challenges} />
        <Route path="/rewards" component={Rewards} />
        <Route path="/achievements" component={Achievements} />
        <Route path="/assistant" component={AIAssistant} />
        <Route path="/profile" component={Profile} />
        <Route path="/questions" component={Questions} />
        <Route component={NotFound} />
      </Switch>
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
