import { useState } from "react";
import { useLocation } from "wouter";
import QuestionCard from "@/components/QuestionCard";
import CelebrationModal from "@/components/CelebrationModal";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Brain, BookOpen } from "lucide-react";

export default function Questions() {
  const [, navigate] = useLocation();
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);

  // TODO: Remove mock data - fetch from backend
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

  const questions = {
    maths: [
      {
        question: "¿Cuánto es 5 + 3?",
        options: ["6", "7", "8", "9"],
        correctAnswer: "8",
        difficulty: 2,
      },
      {
        question: "¿Cuántas patas tiene un perro?",
        options: ["2", "3", "4", "5"],
        correctAnswer: "4",
        difficulty: 2,
      },
      {
        question: "¿Cuánto es 10 - 3?",
        options: ["5", "6", "7", "8"],
        correctAnswer: "7",
        difficulty: 2,
      },
    ],
    english: [
      {
        question: "¿Cómo se dice 'perro' en inglés?",
        options: ["Cat", "Dog", "Fish", "Bird"],
        correctAnswer: "Dog",
        difficulty: 2,
      },
      {
        question: "¿Qué color es 'red' en español?",
        options: ["Azul", "Verde", "Rojo", "Amarillo"],
        correctAnswer: "Rojo",
        difficulty: 2,
      },
      {
        question: "¿Cómo se dice 'casa' en inglés?",
        options: ["House", "Car", "Tree", "Book"],
        correctAnswer: "House",
        difficulty: 2,
      },
    ],
  };

  const handleAnswer = (isCorrect: boolean) => {
    if (isCorrect) {
      setScore(score + 1);
    }

    const currentQuestions = selectedSubject ? questions[selectedSubject as keyof typeof questions] : [];
    
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

  const currentQuestions = questions[selectedSubject as keyof typeof questions];
  const currentQuestion = currentQuestions[currentQuestionIndex];

  return (
    <div className="min-h-screen bg-background">
      <div className="pt-20 md:pt-24 pb-24 md:pb-8">
        <div className="max-w-5xl mx-auto px-4">
          {!quizCompleted ? (
            <QuestionCard
              question={currentQuestion.question}
              options={currentQuestion.options}
              correctAnswer={currentQuestion.correctAnswer}
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
        xpEarned={score * 20}
        onContinue={handleContinue}
      />
    </div>
  );
}
