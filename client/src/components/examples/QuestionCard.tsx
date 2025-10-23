import QuestionCard from '../QuestionCard';

export default function QuestionCardExample() {
  return (
    <div className="p-4">
      <QuestionCard
        question="¿Cuánto es 5 + 3?"
        options={["6", "7", "8", "9"]}
        correctAnswer="8"
        difficulty={2}
        subject="maths"
        currentQuestion={3}
        totalQuestions={10}
        onAnswer={(isCorrect) => console.log('Answer:', isCorrect)}
      />
    </div>
  );
}
