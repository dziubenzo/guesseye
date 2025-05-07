import GameOverConfetti from '@/components/GameOverConfetti';
import Guesses from '@/components/Guesses';
import PlayerForm from '@/components/PlayerForm';
import PlayerToFindCard from '@/components/PlayerToFindCard';
import { getOfficialGame } from '@/server/db/get-official-game';

export default async function OfficialGame() {
  const existingGame = await getOfficialGame();

  if (existingGame) {
    return (
      <>
        <PlayerForm />
        <PlayerToFindCard difficulty={existingGame.playerDifficulty} />
        {existingGame && 'guesses' in existingGame ? (
          <Guesses existingGame={existingGame} />
        ) : (
          <Guesses />
        )}
        <GameOverConfetti />
      </>
    );
  }

  return null;
}
