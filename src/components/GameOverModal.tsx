'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useGameStore } from '@/lib/game-store';
import { useRevalidateCompletedGames } from '@/lib/hooks';
import type { Game, User } from '@/lib/types';
import { Award } from 'lucide-react';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';

type GameOverModalProps = {
  gameId?: Game['id'];
  userId?: User['id'];
};

export default function GameOverModal({ gameId, userId }: GameOverModalProps) {
  const { gameOver, guesses, playerToFind, resetState } = useGameStore();
  const router = useRouter();
  const pathname = usePathname();

  function navigateAfterGameOver() {
    resetState();
    if (pathname.includes('official')) {
      router.push('/official');
    }
  }

  useRevalidateCompletedGames(gameOver, gameId, userId);

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
            <DialogDescription className="sr-only">
              You&apos;ve won the game!
            </DialogDescription>
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
