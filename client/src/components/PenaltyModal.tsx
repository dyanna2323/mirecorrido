import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AlertCircle } from "lucide-react";

interface PenaltyModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApply?: (points: number, reason: string) => void;
}

export default function PenaltyModal({ open, onOpenChange, onApply }: PenaltyModalProps) {
  const [points, setPoints] = useState("");
  const [reason, setReason] = useState("");

  const handleApply = () => {
    const pointsNum = parseInt(points);
    if (pointsNum > 0 && reason.trim()) {
      onApply?.(pointsNum, reason);
      setPoints("");
      setReason("");
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-3xl max-w-md" data-testid="penalty-modal">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-red-100 p-3 rounded-xl">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
            <DialogTitle className="text-2xl">Aplicar Penalización</DialogTitle>
          </div>
          <DialogDescription className="text-base">
            Resta puntos por mal comportamiento. Esto ayudará al niño a aprender.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="points" className="text-base font-semibold">
              Puntos a restar
            </Label>
            <Input
              id="points"
              type="number"
              min="1"
              placeholder="50"
              value={points}
              onChange={(e) => setPoints(e.target.value)}
              className="h-12 text-lg rounded-xl"
              data-testid="input-penalty-points"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="reason" className="text-base font-semibold">
              Razón de la penalización
            </Label>
            <Textarea
              id="reason"
              placeholder="Ejemplo: No hizo la tarea..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="min-h-24 text-base rounded-xl resize-none"
              data-testid="input-penalty-reason"
            />
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="rounded-xl"
            data-testid="button-cancel"
          >
            Cancelar
          </Button>
          <Button
            onClick={handleApply}
            disabled={!points || !reason.trim()}
            className="rounded-xl bg-red-500 hover:bg-red-600"
            data-testid="button-apply-penalty"
          >
            Aplicar Penalización
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
