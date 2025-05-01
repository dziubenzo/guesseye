'use client';

import { useGameStore } from '@/lib/game-store';
import { useWindowSize } from '@uidotdev/usehooks';
import Confetti from 'react-confetti';

export default function GameOverConfetti() {
  const { gameOver } = useGameStore();
  const { width, height } = useWindowSize();

  if (gameOver && width && height) {
    return (
      <Confetti
        className="w-full h-svh"
        width={width}
        height={height}
        gravity={0.15}
        numberOfPieces={400}
        tweenDuration={5000}
        colors={[
          'oklch(0.723 0.219 149.579)',
          'oklch(0.627 0.265 303.9)',
          'oklch(0.769 0.188 70.08)',
        ]}
        recycle={false}
      />
    );
  }

  return null;
}
