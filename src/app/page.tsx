import ErrorPage from '@/components/ErrorPage';
import GameOverConfetti from '@/components/GameOverConfetti';
import GameOverModal from '@/components/GameOverModal';
import GameWon from '@/components/GameWon';
import Guesses from '@/components/Guesses';
import PlayerForm from '@/components/PlayerForm';
import PlayerToFindCard from '@/components/PlayerToFindCard';
import { getOfficialGame } from '@/server/db/get-official-game';

export default async function OfficialGame() {
  const game = await getOfficialGame();

  if ('error' in game) {
    return <ErrorPage errorMessage={game.error} />;
  }

  if ('hasWon' in game) {
    return <GameWon previousGame={game} />;
  }

  if ('hasGivenUp' in game) {
    return <h1>Hi From Game Given Up</h1>;
  }

  if (game) {
    return (
      <div className="flex flex-col gap-4">
        <PlayerForm />
        <PlayerToFindCard difficulty={game.playerDifficulty} />
        {'gameInProgress' in game ? (
          <Guesses existingGame={game} />
        ) : (
          <Guesses />
        )}
        <GameOverConfetti />
        <GameOverModal />
      </div>
    );
  }

  return null;
}
