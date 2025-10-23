import { useState } from 'react';
import CelebrationModal from '../CelebrationModal';
import { Button } from '@/components/ui/button';

export default function CelebrationModalExample() {
  const [open, setOpen] = useState(false);

  return (
    <div className="p-4">
      <Button onClick={() => setOpen(true)} data-testid="button-open-celebration">
        Mostrar Celebración
      </Button>
      <CelebrationModal
        open={open}
        onOpenChange={setOpen}
        title="¡Increíble!"
        message="¡Has completado el desafío!"
        xpEarned={150}
        onContinue={() => console.log('Continue clicked')}
      />
    </div>
  );
}
