import GamePage from '@/components/GamePage';
import GamePageSkeleton from '@/components/skeletons/GamePageSkeletons';
import { auth } from '@/lib/auth';
import { getOfficialGame } from '@/server/db/get-official-game';
import { getPlayerFullNames } from '@/server/db/get-player-full-names';
import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';

export const metadata: Metadata = { title: 'Official Game' };

type PreviousOfficialGameProps = {
  params: Promise<{ scheduleId: string }>;
};

export default async function PreviousOfficialGame({
  params,
}: PreviousOfficialGameProps) {
  const [session, { scheduleId }] = await Promise.all([
    auth.api.getSession({
      headers: await headers(),
    }),
    params,
  ]);

  if (!session) {
    return notFound();
  }

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
