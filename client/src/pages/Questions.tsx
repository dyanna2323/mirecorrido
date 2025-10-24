import { useState } from "react";
import { useLocation } from "wouter";
import QuestionCard from "@/components/QuestionCard";
import CelebrationModal from "@/components/CelebrationModal";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Brain, BookOpen } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Question, UserAnswer, UserStats } from "@shared/schema";

export default function Questions() {
  const [, navigate] = useLocation();
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [totalXP, setTotalXP] = useState(0);
  const { user, isLoading: authLoading } = useAuth();
  const { toast } = useToast();

  const subjects = [
    {
      id: "maths",
      name: "Matemáticas",
      icon: Brain,
      color: "from-blue-500 to-blue-600",
    },
    {
      id: "english",
      name: "Inglés",
      icon: BookOpen,
      color: "from-green-500 to-green-600",
    },
  ];

  const { data: questions, isLoading: questionsLoading } = useQuery<Question[]>({
    queryKey: [`/api/questions/${selectedSubject}`],
    enabled: !!selectedSubject,
  });

  const { data: userAnswers } = useQuery<UserAnswer[]>({
    queryKey: ["/api/me/answers"],
    enabled: !!user,
  });

  const submitAnswerMutation = useMutation({
    mutationFn: async ({ questionId, selectedAnswer }: { questionId: string; selectedAnswer: number }) => {
      const res = await apiRequest("POST", "/api/me/answers", { questionId, selectedAnswer });
      return res.json();
    },
    onSuccess: (data: { isCorrect: boolean; xpEarned: number; stats: UserStats }) => {
      queryClient.invalidateQueries({ queryKey: ["/api/me/answers"] });
      queryClient.invalidateQueries({ queryKey: ["/api/me"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard"] });
      
      if (data.isCorrect) {
        setScore(score + 1);
        setTotalXP(totalXP + data.xpEarned);
      }
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "No se pudo enviar la respuesta",
        variant: "destructive",
      });
    },
  });

  const handleAnswer = (isCorrect: boolean, selectedAnswerIndex: number) => {
    const currentQuestion = questions?.[currentQuestionIndex];
    if (!currentQuestion) return;

    submitAnswerMutation.mutate({
      questionId: currentQuestion.id,
      selectedAnswer: selectedAnswerIndex,
    });

    const currentQuestions = questions || [];
    
    if (currentQuestionIndex < currentQuestions.length - 1) {
      setTimeout(() => {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      }, 1500);
    } else {
      setTimeout(() => {
        setQuizCompleted(true);
        setShowCelebration(true);
      }, 1500);
    }
  };

  const handleContinue = () => {
    navigate("/");
  };

  const resetQuiz = () => {
    setSelectedSubject(null);
    setCurrentQuestionIndex(0);
    setScore(0);
    setTotalXP(0);
    setQuizCompleted(false);
  };

  if (!selectedSubject) {
    return (
      <div className="min-h-screen bg-background">
        <div className="pt-20 md:pt-24 pb-24 md:pb-8">
          <div className="max-w-4xl mx-auto px-4 space-y-6">
            <div className="text-center space-y-2">
              <h1 className="text-3xl md:text-4xl font-bold">Preguntas</h1>
              <p className="text-muted-foreground text-lg">
                ¿Qué quieres practicar hoy?
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {subjects.map((subject) => {
                const Icon = subject.icon;
                return (
                  <Card
                    key={subject.id}
                    onClick={() => setSelectedSubject(subject.id)}
                    className="rounded-3xl p-8 hover-elevate active-elevate-2 transition-all duration-300 cursor-pointer"
                    data-testid={`subject-${subject.id}`}
                  >
                    <div className="space-y-6 text-center">
                      <div className={`w-24 h-24 mx-auto rounded-2xl bg-gradient-to-br ${subject.color} flex items-center justify-center`}>
                        <Icon className="w-12 h-12 text-white" />
                      </div>
                      <h2 className="text-2xl font-bold">{subject.name}</h2>
                      <Button className="w-full h-12 rounded-xl">
                        Comenzar
                      </Button>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (questionsLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="pt-20 md:pt-24 pb-24 md:pb-8">
          <div className="max-w-5xl mx-auto px-4">
            <Skeleton className="h-96 rounded-3xl" />
          </div>
        </div>
      </div>
    );
  }

  const currentQuestions = questions || [];
  const currentQuestion = currentQuestions[currentQuestionIndex];

  if (!currentQuestion && !quizCompleted) {
    return (
      <div className="min-h-screen bg-background">
        <div className="pt-20 md:pt-24 pb-24 md:pb-8">
          <div className="max-w-5xl mx-auto px-4">
            <Card className="rounded-3xl p-12 text-center space-y-6">
              <h2 className="text-2xl font-bold">No hay preguntas disponibles</h2>
              <Button onClick={resetQuiz} className="rounded-xl">
                Elegir Otro Tema
              </Button>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="pt-20 md:pt-24 pb-24 md:pb-8">
        <div className="max-w-5xl mx-auto px-4">
          {!quizCompleted ? (
            <QuestionCard
              question={currentQuestion.question}
              options={currentQuestion.options}
              correctAnswer={currentQuestion.options[currentQuestion.correctAnswer]}
              difficulty={currentQuestion.difficulty}
              subject={selectedSubject}
              currentQuestion={currentQuestionIndex + 1}
              totalQuestions={currentQuestions.length}
              onAnswer={handleAnswer}
            />
          ) : (
            <Card className="rounded-3xl p-12 text-center space-y-6">
              <h2 className="text-3xl font-bold">¡Quiz Completado!</h2>
              <div className="text-6xl font-bold text-primary">
                {score}/{currentQuestions.length}
              </div>
              <p className="text-xl text-muted-foreground">
                {score === currentQuestions.length
                  ? "¡Perfecto! Todas correctas"
                  : score >= currentQuestions.length / 2
                  ? "¡Muy bien! Sigue practicando"
                  : "¡Buen intento! Puedes mejorar"}
              </p>
              <div className="flex gap-4 justify-center">
                <Button onClick={resetQuiz} variant="outline" className="rounded-xl">
                  Elegir Otro Tema
                </Button>
                <Button onClick={handleContinue} className="rounded-xl">
                  Volver al Inicio
                </Button>
              </div>
            </Card>
          )}
        </div>
      </div>

      <CelebrationModal
        open={showCelebration}
        onOpenChange={setShowCelebration}
        title="¡Quiz Completado!"
        message={`Respondiste ${score} de ${currentQuestions.length} correctamente`}
        xpEarned={totalXP}
        onContinue={handleContinue}
      />
    </div>
  );
}
