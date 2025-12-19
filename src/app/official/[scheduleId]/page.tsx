import ErrorPage from '@/components/ErrorPage';
import GameOverConfetti from '@/components/GameOverConfetti';
import GameOverModal from '@/components/GameOverModal';
import GiveUpButton from '@/components/GiveUpButton';
import Guesses from '@/components/Guesses';
import GuessForm from '@/components/GuessForm';
import HintsButton from '@/components/HintsButton';
import ModeIndicator from '@/components/ModeIndicator';
import PlayerToFindCard from '@/components/PlayerToFindCard';
import PlayerToFindInfo from '@/components/PlayerToFindInfo';
import TopBar from '@/components/TopBar';
import { getOfficialGame } from '@/server/db/get-official-game';
import { getPlayerFullNames } from '@/server/db/get-player-full-names';
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
  const [game, names] = await Promise.all([
    getOfficialGame(scheduleId),
    getPlayerFullNames(),
  ]);

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
      hints,
      availableHints,
    } = game;

    return (
      <div className="flex flex-col gap-4">
        <TopBar>
          <div className="flex gap-2">
            <HintsButton hints={hints} availableHints={availableHints} />
            <GiveUpButton scheduleId={scheduleId} />
          </div>
          <GuessForm names={names} scheduleId={scheduleId} />
        </TopBar>
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
