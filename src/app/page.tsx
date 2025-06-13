import ErrorPage from '@/components/ErrorPage';
import GameGivenUp from '@/components/GameGivenUp';
import GameOverConfetti from '@/components/GameOverConfetti';
import GameOverModal from '@/components/GameOverModal';
import GameWon from '@/components/GameWon';
import Guesses from '@/components/Guesses';
import PlayerForm from '@/components/PlayerForm';
import PlayerToFindCard from '@/components/PlayerToFindCard';
import PlayerToFindInfo from '@/components/PlayerToFindInfo';
import { auth } from '@/lib/auth';
import { getOfficialGame } from '@/server/db/get-official-game';
import { getRandomGame } from '@/server/db/get-random-game';
import { headers } from 'next/headers';

export default async function CurrentGame() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session) {
    const game = await getOfficialGame();

    if ('error' in game) {
      return <ErrorPage errorMessage={game.error} />;
    }

    if ('hasWon' in game) {
      return <GameWon previousGame={game} />;
    }

    if ('hasGivenUp' in game) {
      return <GameGivenUp previousGame={game} />;
    }

    if (game) {
      const { playerDifficulty, winnersCount, nextPlayerStartDate, gameMode } =
        game;

      return (
        <div className="flex flex-col gap-4">
          <PlayerForm />
          <PlayerToFindInfo
            winnersCount={winnersCount}
            nextPlayerStartDate={nextPlayerStartDate}
          />
          <PlayerToFindCard difficulty={playerDifficulty} />
          {'gameInProgress' in game ? (
            <Guesses existingGame={game} gameMode={gameMode} />
          ) : (
            <Guesses gameMode={gameMode} />
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

  const { playerDifficulty, gameMode } = game;

  return (
    <div className="flex flex-col gap-4">
      <PlayerForm />
      <PlayerToFindCard difficulty={playerDifficulty} />
      <Guesses existingGame={game} gameMode={gameMode} />
      <GameOverConfetti />
      <GameOverModal />
    </div>
  );
}
