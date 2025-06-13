'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useGameStore } from '@/lib/game-store';
import { Award } from 'lucide-react';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';

export default function GameOverModal() {
  const { gameOver, guesses, playerToFind, resetState } = useGameStore();
  const router = useRouter();
  const pathname = usePathname();

  function navigateAfterGameOver() {
    if (pathname.includes('official')) {
      router.push('/official');
    } else {
      resetState();
      router.refresh();
    }
  }

  if (gameOver && playerToFind) {
    return (
      <Dialog defaultOpen onOpenChange={navigateAfterGameOver}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-2xl text-center flex justify-center items-center gap-1">
              <Award />
              YOU DID IT
              <Award />
            </DialogTitle>
          </DialogHeader>
          <Image
            className="rounded-md shadow-md"
            src="/dancing_dimi.gif"
            alt="A dancing Dimitri Van den Bergh on the stage"
            priority={true}
            width={500}
            height={500}
            unoptimized
          />
          <div className="flex flex-col justify-center items-center gap-2">
            <p>
              It took you{' '}
              <span className="font-bold">
                {guesses.length} {guesses.length === 1 ? 'try' : 'tries'}
              </span>{' '}
              to find
            </p>
            <span className="text-2xl font-bold uppercase">
              {playerToFind.firstName} {playerToFind.lastName}
            </span>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return null;
}
