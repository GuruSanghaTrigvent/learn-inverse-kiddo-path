
import { useCallback } from 'react';
import confetti from 'canvas-confetti';

export const useConfetti = () => {
  const triggerConfetti = useCallback(() => {
    const colors = ['#FEC6A1', '#E5DEFF', '#FFDEE2', '#D3E4FD', '#F2FCE2'];
    
    for (let i = 0; i < 3; i++) {
      setTimeout(() => {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors,
          shapes: ['star', 'circle'],
          ticks: 300,
        });
      }, i * 300);
    }
  }, []);

  return {
    triggerConfetti
  };
};
