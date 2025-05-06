import GameOverConfetti from '@/components/GameOverConfetti';
import Guesses from '@/components/Guesses';
import PlayerForm from '@/components/PlayerForm';
import PlayerToFindCard from '@/components/PlayerToFindCard';
import { getScheduledPlayerDifficulty } from '@/server/db/get-scheduled-player-difficulty';

export default async function OfficialGame() {
  const difficulty = await getScheduledPlayerDifficulty();

  if (!difficulty) {
    return <h1>Error. No scheduled player to find.</h1>;
  }

  return (
    <>
      <PlayerForm />
      <PlayerToFindCard difficulty={difficulty} />
      <Guesses />
      <GameOverConfetti />
    </>
  );
}
