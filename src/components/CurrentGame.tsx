import GamePage from '@/components/GamePage';
import GamePageSkeleton from '@/components/skeletons/GamePageSkeletons';
import { type Session } from '@/lib/auth';
import { getOfficialGame } from '@/server/db/get-official-game';
import { getPlayerFullNames } from '@/server/db/get-player-full-names';
import { getRandomGame } from '@/server/db/get-random-game';
import { Suspense, use } from 'react';

type CurrentGameProps = {
  sessionPromise: Promise<Session | null>;
};

export default function CurrentGame({ sessionPromise }: CurrentGameProps) {
  const session = use(sessionPromise);
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
    const gamePromise = getRandomGame();

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
