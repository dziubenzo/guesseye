import GamePage from '@/components/GamePage';
import GamePageSkeleton from '@/components/skeletons/GamePageSkeletons';
import { auth } from '@/lib/auth';
import { getOfficialGame } from '@/server/db/get-official-game';
import { getPlayerFullNames } from '@/server/db/get-player-full-names';
import { getRandomGame } from '@/server/db/get-random-game';
import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { Suspense } from 'react';

export const metadata: Metadata = { title: 'GuessEye' };

export default async function CurrentGame() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const namesPromise = getPlayerFullNames();

  if (session) {
    const gamePromise = getOfficialGame();

    return (
      <Suspense fallback={<GamePageSkeleton isOfficialGame />}>
        <GamePage
          gameMode="official"
          gamePromise={gamePromise}
          namesPromise={namesPromise}
          userId={session.user.id}
        />
      </Suspense>
    );
  } else {
    const gamePromise = getRandomGame({ isGuest: true });

    return (
      <Suspense fallback={<GamePageSkeleton />}>
        <GamePage
          gameMode="random"
          gamePromise={gamePromise}
          namesPromise={namesPromise}
        />
      </Suspense>
    );
  }
}
