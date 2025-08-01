'use client';

import PlayerCard from '@/components/PlayerCard';
import TimeLeftTooltip from '@/components/TimeLeftTooltip';
import { useUpdateTimeLeft } from '@/lib/hooks';
import type { GameGivenUp as GameGivenUpType } from '@/lib/types';

type GameGivenUpProps = {
  previousGame: GameGivenUpType;
};

export default function GameGivenUp({ previousGame }: GameGivenUpProps) {
  const {
    previousPlayer,
    previousPlayerDifficulty,
    nextPlayerStartDate,
    nextPlayerDifficulty,
    attempts,
  } = previousGame;
  const { timeLeft } = useUpdateTimeLeft(nextPlayerStartDate);

  return (
    <div className="flex flex-col grow-1 text-center justify-center items-center gap-4">
      <h2 className="text-2xl">You missed out on...</h2>
      <PlayerCard
        type="playerToFind"
        previousMatches={previousPlayer}
        currentMatches={previousPlayer}
        difficulty={previousPlayerDifficulty}
      />
      {attempts > 0 ? (
        <>
          <p>
            You gave {previousPlayer.gender === 'male' ? 'him' : 'her'} at least{' '}
            <span className="font-bold">{attempts}</span>{' '}
            {attempts === 1 ? 'try' : 'tries'}. Good job!
          </p>
        </>
      ) : (
        <p>
          And you did not even try to guess{' '}
          {previousPlayer.gender === 'male' ? 'him' : 'her'}...
        </p>
      )}
      <div className="p-8 flex flex-col justify-center items-center gap-4 w-full rounded-3xl">
        <p className="text-sm">
          The next darts player (
          <span className="font-medium">{nextPlayerDifficulty}</span>{' '}
          difficulty) unlocks in
        </p>
        <div className="relative">
          <p className="text-2xl" suppressHydrationWarning>
            {timeLeft}
          </p>
          <TimeLeftTooltip nextPlayerStartDate={nextPlayerStartDate} />
        </div>
      </div>
    </div>
  );
}
