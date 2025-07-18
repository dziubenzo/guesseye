import ErrorPage from '@/components/ErrorPage';
import GameGivenUp from '@/components/GameGivenUp';
import GameOverConfetti from '@/components/GameOverConfetti';
import GameOverModal from '@/components/GameOverModal';
import GameWon from '@/components/GameWon';
import Guesses from '@/components/Guesses';
import ModeIndicator from '@/components/ModeIndicator';
import PlayerForm from '@/components/PlayerForm';
import PlayerToFindCard from '@/components/PlayerToFindCard';
import PlayerToFindInfo from '@/components/PlayerToFindInfo';
import { auth } from '@/lib/auth';
import { getOfficialGame } from '@/server/db/get-official-game';
import { getRandomGame } from '@/server/db/get-random-game';
import type { Metadata } from 'next';
import { headers } from 'next/headers';

export const metadata: Metadata = { title: 'GuessEye' };

export default async function CurrentGame() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

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

    if (game) {
      const {
        playerDifficulty,
        winnersCount,
        nextPlayerStartDate,
        mode,
        status,
      } = game;

      return (
        <div className="flex flex-col gap-4">
          <PlayerForm />
          <ModeIndicator />
          <PlayerToFindInfo
            winnersCount={winnersCount}
            nextPlayerStartDate={nextPlayerStartDate}
          />
          <PlayerToFindCard difficulty={playerDifficulty} />
          {status === 'inProgress' ? (
            <Guesses existingGame={game} mode={mode} />
          ) : (
            <Guesses mode={mode} />
          )}
          <GameOverConfetti />
          <GameOverModal />
        </div>
      );
    }
  }

  const game = await getRandomGame();

  if ('error' in game) {
    return <ErrorPage errorMessage={game.error} />;
  }

  const { playerDifficulty, mode } = game;

  return (
    <div className="flex flex-col gap-4">
      <PlayerForm />
      <ModeIndicator />
      <PlayerToFindCard difficulty={playerDifficulty} />
      <Guesses existingGame={game} mode={mode} />
      <GameOverConfetti />
      <GameOverModal />
    </div>
  );
}
