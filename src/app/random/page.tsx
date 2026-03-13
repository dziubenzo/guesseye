import ErrorPage from '@/components/ErrorPage';
import GamePage from '@/components/GamePage';
import { auth } from '@/lib/auth';
import { getPlayerFullNames } from '@/server/db/get-player-full-names';
import { getRandomGame } from '@/server/db/get-random-game';
import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { notFound } from 'next/navigation';

export const metadata: Metadata = { title: 'Random Game' };

export default async function RandomGame() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return notFound();
  }

  const [game, names] = await Promise.all([
    getRandomGame(),
    getPlayerFullNames(),
  ]);

  if ('error' in game) {
    return <ErrorPage errorMessage={game.error} />;
  }

  return (
    <GamePage
      gameMode="random"
      game={game}
      names={names}
      allowVeryHard={session.user.allowVeryHard}
      userId={session.user.id}
    />
  );
}
