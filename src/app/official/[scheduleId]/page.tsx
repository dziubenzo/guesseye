import ErrorPage from '@/components/ErrorPage';
import GameOverConfetti from '@/components/GameOverConfetti';
import GameOverModal from '@/components/GameOverModal';
import Guesses from '@/components/Guesses';
import ModeIndicator from '@/components/ModeIndicator';
import PlayerForm from '@/components/PlayerForm';
import PlayerToFindCard from '@/components/PlayerToFindCard';
import PlayerToFindInfo from '@/components/PlayerToFindInfo';
import { getOfficialGame } from '@/server/db/get-official-game';
import { notFound } from 'next/navigation';

type PreviousOfficialGameProps = {
  params: Promise<{ scheduleId: string }>;
};

export default async function PreviousOfficialGame({
  params,
}: PreviousOfficialGameProps) {
  const { scheduleId } = await params;
  const game = await getOfficialGame(scheduleId);

  if ('error' in game) {
    return <ErrorPage errorMessage={game.error} />;
  }

  if ('hasWon' in game || 'hasGivenUp' in game) {
    return notFound();
  }

  if (game) {
    const { playerDifficulty, winnersCount, mode } = game;

    return (
      <div className="flex flex-col gap-4">
        <PlayerForm scheduleId={scheduleId} />
        <ModeIndicator />
        <PlayerToFindInfo winnersCount={winnersCount} />
        <PlayerToFindCard difficulty={playerDifficulty} />
        {'inProgress' in game ? (
          <Guesses existingGame={game} mode={mode} />
        ) : (
          <Guesses mode={mode} />
        )}
        <GameOverConfetti />
        <GameOverModal />
      </div>
    );
  }

  return null;
}
