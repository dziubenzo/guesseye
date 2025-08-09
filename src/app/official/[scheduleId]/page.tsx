import ErrorPage from '@/components/ErrorPage';
import GameOverConfetti from '@/components/GameOverConfetti';
import GameOverModal from '@/components/GameOverModal';
import Guesses from '@/components/Guesses';
import ModeIndicator from '@/components/ModeIndicator';
import PlayerForm from '@/components/PlayerForm';
import PlayerToFindCard from '@/components/PlayerToFindCard';
import PlayerToFindInfo from '@/components/PlayerToFindInfo';
import { getOfficialGame } from '@/server/db/get-official-game';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

export const metadata: Metadata = { title: 'Official Game' };

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

  if (game.status === 'won' || game.status === 'givenUp') {
    return notFound();
  }

  if (game) {
    const {
      guesses,
      playerToFindMatches,
      winnersCount,
      mode,
      playerDifficulty,
    } = game;

    return (
      <div className="flex flex-col gap-4">
        <PlayerForm scheduleId={scheduleId} />
        <ModeIndicator />
        <PlayerToFindInfo winnersCount={winnersCount} />
        <PlayerToFindCard />
        <Guesses
          initialGuesses={guesses}
          playerToFindMatches={playerToFindMatches}
          mode={mode}
          playerDifficulty={playerDifficulty}
        />
        <GameOverConfetti />
        <GameOverModal />
      </div>
    );
  }

  return null;
}
