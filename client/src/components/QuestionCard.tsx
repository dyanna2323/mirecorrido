import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle } from "lucide-react";
import ProgressBar from "./ProgressBar";

interface QuestionCardProps {
  question: string;
  options: string[];
  correctAnswer: string;
  difficulty: number;
  subject: string;
  currentQuestion: number;
  totalQuestions: number;
  onAnswer?: (isCorrect: boolean) => void;
}

export default function QuestionCard({
  question,
  options,
  correctAnswer,
  difficulty,
  subject,
  currentQuestion,
  totalQuestions,
  onAnswer,
}: QuestionCardProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);

  const handleOptionClick = (option: string) => {
    if (showFeedback) return;
    
    setSelectedOption(option);
    setShowFeedback(true);
    
    const isCorrect = option === correctAnswer;
    setTimeout(() => {
      onAnswer?.(isCorrect);
      setSelectedOption(null);
      setShowFeedback(false);
    }, 1500);
  };

  const isCorrect = selectedOption === correctAnswer;

  const subjectColors: Record<string, string> = {
    maths: "bg-blue-100 text-blue-700",
    english: "bg-green-100 text-green-700",
    matematicas: "bg-blue-100 text-blue-700",
    ingles: "bg-green-100 text-green-700",
  };

  return (
    <Card className="rounded-3xl p-8 md:p-12 max-w-4xl mx-auto shadow-xl" data-testid="question-card">
      <div className="space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <Badge className={`${subjectColors[subject]} rounded-lg text-sm`}>
            {subject === "maths" || subject === "matematicas" ? "Matemáticas" : "Inglés"}
          </Badge>
          <div className="flex gap-2">
            {Array.from({ length: difficulty }, (_, i) => (
              <span key={i} className="text-yellow-400">⭐</span>
            ))}
          </div>
        </div>

        <ProgressBar
          current={currentQuestion}
          max={totalQuestions}
          label={`Pregunta ${currentQuestion} de ${totalQuestions}`}
          height="md"
        />

        <div className="py-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center leading-tight">
            {question}
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {options.map((option, index) => {
            const isSelected = selectedOption === option;
            const isCorrectOption = option === correctAnswer;
            
            let buttonClass = "min-h-24 text-xl rounded-2xl font-semibold transition-all duration-300";
            
            if (showFeedback) {
              if (isSelected && isCorrect) {
                buttonClass += " bg-green-500 hover:bg-green-600 text-white ring-4 ring-green-300";
              } else if (isSelected && !isCorrect) {
                buttonClass += " bg-red-500 hover:bg-red-600 text-white ring-4 ring-red-300";
              } else if (isCorrectOption) {
                buttonClass += " bg-green-500 hover:bg-green-600 text-white";
              }
            } else {
              buttonClass += " hover:scale-105 hover:shadow-lg";
            }

            return (
              <Button
                key={index}
                onClick={() => handleOptionClick(option)}
                disabled={showFeedback}
                className={buttonClass}
                variant={showFeedback ? "default" : "outline"}
                data-testid={`option-${index}`}
              >
                <div className="flex items-center gap-3 w-full">
                  {showFeedback && isSelected && (
                    isCorrect ? (
                      <CheckCircle2 className="w-6 h-6" />
                    ) : (
                      <XCircle className="w-6 h-6" />
                    )
                  )}
                  <span className="flex-1">{option}</span>
                </div>
              </Button>
            );
          })}
        </div>

        {showFeedback && (
          <div className={`text-center text-xl font-bold p-4 rounded-2xl ${
            isCorrect ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
          }`}>
            {isCorrect ? "¡Muy bien! 🎉" : "Casi lo logras, sigue intentando 💪"}
          </div>
        )}
      </div>
    </Card>
  );
}
