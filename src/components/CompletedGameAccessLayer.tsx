import CompletedGame from '@/components/CompletedGame';
import CompletedGameSkeleton from '@/components/skeletons/CompletedGameSkeletons';
import type { Session } from '@/lib/auth';
import { getCompletedGame } from '@/server/db/get-completed-game';
import { notFound } from 'next/navigation';
import { Suspense, use } from 'react';

type CompletedGameAccessLayerProps = {
  sessionPromise: Promise<Session | null>;
  paramsPromise: Promise<{
    gameId: string;
  }>;
};

export default function CompletedGameAccessLayer({
  sessionPromise,
  paramsPromise,
}: CompletedGameAccessLayerProps) {
  const session = use(sessionPromise);

  if (!session) {
    return notFound();
  }

  const { gameId } = use(paramsPromise);

  const completedGamePromise = getCompletedGame(gameId);

  return (
    <Suspense fallback={<CompletedGameSkeleton />}>
      <CompletedGame
        gameId={gameId}
        completedGamePromise={completedGamePromise}
      />
    </Suspense>
  );
}
