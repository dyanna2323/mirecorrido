import { useState } from 'react';
import PenaltyModal from '../PenaltyModal';
import { Button } from '@/components/ui/button';

export default function PenaltyModalExample() {
  const [open, setOpen] = useState(false);

  return (
    <div className="p-4">
      <Button onClick={() => setOpen(true)} data-testid="button-open-modal">
        Abrir Modal de Penalización
      </Button>
      <PenaltyModal
        open={open}
        onOpenChange={setOpen}
        onApply={(points, reason) => {
          console.log('Penalty applied:', points, reason);
        }}
      />
    </div>
  );
}
