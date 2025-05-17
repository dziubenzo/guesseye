import ErrorPage from '@/components/ErrorPage';
import GameOverConfetti from '@/components/GameOverConfetti';
import GameOverModal from '@/components/GameOverModal';
import Guesses from '@/components/Guesses';
import PlayerForm from '@/components/PlayerForm';
import PlayerToFindCard from '@/components/PlayerToFindCard';
import PlayerToFindInfo from '@/components/PlayerToFindInfo';
import { getOfficialGame } from '@/server/db/get-official-game';

type PreviousOfficialGameProps = {
  params: Promise<{ scheduleId: string }>;
};

export default async function PreviousOfficialGame({
  params,
}: PreviousOfficialGameProps) {
  const { scheduleId } = await params;
  const game = await getOfficialGame(scheduleId);

  // TODO: Handle these three states better
  if ('error' in game) {
    return <ErrorPage errorMessage={game.error} />;
  }

  if ('hasWon' in game) {
    return <ErrorPage errorMessage={'You have already won this game, GG!'} />;
  }

  if ('hasGivenUp' in game) {
    return (
      <ErrorPage errorMessage={'You have already given up on this game...'} />
    );
  }

  if (game) {
    const { playerDifficulty, winnersCount } = game;

    return (
      <div className="flex flex-col gap-4">
        <PlayerForm />
        <PlayerToFindInfo winnersCount={winnersCount} />
        <PlayerToFindCard difficulty={playerDifficulty} />
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
