import GamePage from '@/components/GamePage';
import GamePageSkeleton from '@/components/skeletons/GamePageSkeletons';
import { auth } from '@/lib/auth';
import { getPlayerFullNames } from '@/server/db/get-player-full-names';
import { getRandomGame } from '@/server/db/get-random-game';
import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';

export const metadata: Metadata = { title: 'Random Game' };

export default async function RandomGame() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

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
