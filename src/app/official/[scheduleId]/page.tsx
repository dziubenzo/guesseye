import ErrorPage from '@/components/ErrorPage';
import GamePage from '@/components/GamePage';
import { auth } from '@/lib/auth';
import { getOfficialGame } from '@/server/db/get-official-game';
import { getPlayerFullNames } from '@/server/db/get-player-full-names';
import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { notFound } from 'next/navigation';

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

  const [game, names] = await Promise.all([
    getOfficialGame(scheduleId),
    getPlayerFullNames(),
  ]);

  if ('error' in game) {
    return <ErrorPage errorMessage={game.error} />;
  }

  if (game.status === 'won' || game.status === 'givenUp') {
    return notFound();
  }

  return (
    <GamePage
      gameMode="official"
      game={game}
      names={names}
      scheduleId={scheduleId}
      userId={session.user.id}
    />
  );
}
