import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Trophy, Star } from "lucide-react";
import confetti from "canvas-confetti";
import { useEffect } from "react";

interface CelebrationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  message?: string;
  xpEarned?: number;
  onContinue?: () => void;
}

export default function CelebrationModal({
  open,
  onOpenChange,
  title = "¡Excelente Trabajo!",
  message = "Has completado el desafío",
  xpEarned,
  onContinue,
}: CelebrationModalProps) {
  useEffect(() => {
    if (open) {
      const duration = 3000;
      const end = Date.now() + duration;

      const frame = () => {
        confetti({
          particleCount: 2,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ['#a855f7', '#ec4899', '#f59e0b'],
        });
        confetti({
          particleCount: 2,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ['#a855f7', '#ec4899', '#f59e0b'],
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };

      frame();
    }
  }, [open]);

  const handleContinue = () => {
    onContinue?.();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-3xl max-w-md text-center p-12" data-testid="celebration-modal">
        <div className="space-y-6">
          <div className="flex justify-center">
            <div className="w-24 h-24 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center animate-bounce shadow-lg">
              <Trophy className="w-12 h-12 text-white" />
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="text-3xl font-bold">{title}</h2>
            <p className="text-lg text-muted-foreground">{message}</p>
          </div>

          {xpEarned && (
            <div className="bg-yellow-100 rounded-2xl p-6 space-y-2">
              <div className="flex items-center justify-center gap-2">
                <Star className="w-8 h-8 fill-yellow-500 text-yellow-500" />
                <span className="text-4xl font-bold text-yellow-900">+{xpEarned}</span>
                <Star className="w-8 h-8 fill-yellow-500 text-yellow-500" />
              </div>
              <p className="text-yellow-900 font-semibold">XP ganados</p>
            </div>
          )}

          <Button
            onClick={handleContinue}
            className="w-full h-14 text-lg rounded-xl"
            data-testid="button-continue"
          >
            ¡Continuar!
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
