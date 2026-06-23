import GamePage from '@/components/GamePage';
import GamePageSkeleton from '@/components/skeletons/GamePageSkeletons';
import type { Session } from '@/lib/auth';
import { getPlayerFullNames } from '@/server/db/get-player-full-names';
import { getRandomGame } from '@/server/db/get-random-game';
import { notFound } from 'next/navigation';
import { Suspense, use } from 'react';

type RandomGameProps = {
  sessionPromise: Promise<Session | null>;
};

export default function RandomGame({ sessionPromise }: RandomGameProps) {
  const session = use(sessionPromise);

  if (!session) {
    return notFound();
  }

  const gamePromise = getRandomGame();
  const namesPromise = getPlayerFullNames();
  
  return (
    <Suspense fallback={<GamePageSkeleton />}>
      <GamePage
        gameMode="random"
        gamePromise={gamePromise}
        namesPromise={namesPromise}
        allowVeryHard={session.user.allowVeryHard}
        userId={session.user.id}
      />
    </Suspense>
  );
}
