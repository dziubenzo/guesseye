import GamePage from '@/components/GamePage';
import GamePageSkeleton from '@/components/skeletons/GamePageSkeletons';
import type { Session } from '@/lib/auth';
import { getOfficialGame } from '@/server/db/get-official-game';
import { getPlayerFullNames } from '@/server/db/get-player-full-names';
import { notFound } from 'next/navigation';
import { Suspense, use } from 'react';

type OfficialGameProps = {
  sessionPromise: Promise<Session | null>;
  paramsPromise: Promise<{ scheduleId: string }>;
};

export default function OfficialGame({
  sessionPromise,
  paramsPromise,
}: OfficialGameProps) {
  const session = use(sessionPromise);

  if (!session) {
    return notFound();
  }

  const { scheduleId } = use(paramsPromise);

  const gamePromise = getOfficialGame(scheduleId);
  const namesPromise = getPlayerFullNames();

  return (
    <Suspense fallback={<GamePageSkeleton isOfficialGame />}>
      <GamePage
        gameMode="official"
        gamePromise={gamePromise}
        namesPromise={namesPromise}
        scheduleId={scheduleId}
        userId={session.user.id}
      />
    </Suspense>
  );
}
