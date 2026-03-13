import ErrorPage from '@/components/ErrorPage';
import GameGivenUp from '@/components/GameGivenUp';
import GamePage from '@/components/GamePage';
import GameWon from '@/components/GameWon';
import { auth } from '@/lib/auth';
import { getOfficialGame } from '@/server/db/get-official-game';
import { getPlayerFullNames } from '@/server/db/get-player-full-names';
import { getRandomGame } from '@/server/db/get-random-game';
import type { Metadata } from 'next';
import { headers } from 'next/headers';

export const metadata: Metadata = { title: 'GuessEye' };

export default async function CurrentGame() {
  const [session, names] = await Promise.all([
    auth.api.getSession({
      headers: await headers(),
    }),
    getPlayerFullNames(),
  ]);

  if (session) {
    const game = await getOfficialGame();

    if ('error' in game) {
      return <ErrorPage errorMessage={game.error} />;
    }

    if (game.status === 'won') {
      return <GameWon previousGame={game} />;
    }

    if (game.status === 'givenUp') {
      return <GameGivenUp previousGame={game} />;
    }

    return (
      <GamePage
        gameMode="official"
        game={game}
        names={names}
        userId={session.user.id}
      />
    );
  } else {
    const game = await getRandomGame({ isGuest: true });

    if ('error' in game) {
      return <ErrorPage errorMessage={game.error} />;
    }

    return <GamePage gameMode="random" game={game} names={names} />;
  }
}
