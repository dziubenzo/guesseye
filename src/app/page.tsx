import GameOverConfetti from '@/components/GameOverConfetti';
import Guesses from '@/components/Guesses';
import PlayerForm from '@/components/PlayerForm';
import PlayerToFindCard from '@/components/PlayerToFindCard';
import { getOfficialGame } from '@/server/db/get-official-game';

export default async function OfficialGame() {
  const game = await getOfficialGame();

  if ('error' in game) {
    return <h1>{game.error}</h1>;
  }

  if ('hasWon' in game) {
    return <h1>Hi from Game Won</h1>;
  }

  if ('hasGivenUp' in game) {
    return <h1>Hi From Game Given Up</h1>;
  }

  if (game) {
    return (
      <>
        <PlayerForm />
        <PlayerToFindCard difficulty={game.playerDifficulty} />
        {'gameInProgress' in game ? (
          <Guesses existingGame={game} />
        ) : (
          <Guesses />
        )}
        <GameOverConfetti />
      </>
    );
  }

  return null;
}
