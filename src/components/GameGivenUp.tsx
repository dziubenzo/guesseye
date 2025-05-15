'use client';

import PlayerCard from '@/components/PlayerCard';
import Tooltip from '@/components/Tooltip';
import { useUpdateTimeLeft } from '@/lib/hooks';
import type { GameGivenUp as GameGivenUpType } from '@/lib/types';
import { format } from 'date-fns';

type GameGivenUpProps = {
  previousGame: GameGivenUpType;
};

export default function GameGivenUp({ previousGame }: GameGivenUpProps) {
  const {
    previousPlayer,
    nextPlayerStartDate,
    nextPlayerDifficulty,
    attempts,
  } = previousGame;
  const { timeLeft, timeInSeconds } = useUpdateTimeLeft(nextPlayerStartDate);

  return (
    <div className="flex flex-col grow-1 text-center justify-center items-center gap-4">
      <h2 className="text-2xl md:self-start">You missed out on...</h2>
      <PlayerCard
        type="playerToFind"
        player={previousPlayer}
        difficulty={previousPlayer.difficulty}
      />
      {attempts > 0 ? (
        <>
          <p className="md:self-start">
            You gave {previousPlayer.gender === 'male' ? 'him' : 'her'} at least{' '}
            <span className="font-bold">{attempts}</span>{' '}
            {attempts === 1 ? 'try' : 'tries'}. Good job!
          </p>
        </>
      ) : (
        <p className="md:self-start">
          And you did not even try to guess{' '}
          {previousPlayer.gender === 'male' ? 'him' : 'her'}...
        </p>
      )}
      <div className="p-8 flex flex-col justify-center items-center gap-4 w-full bg-primary-foreground rounded-3xl">
        <p className="text-sm">
          The next darts player (
          <span className="font-bold">{nextPlayerDifficulty}</span> difficulty)
          unlocks in
        </p>
        <div className="relative">
          <p className="text-2xl" suppressHydrationWarning>
            {timeLeft} ({timeInSeconds}{' '}
            {timeInSeconds === 1 ? 'second' : 'seconds'})
          </p>
          <div className="absolute -top-1 -right-4">
            <Tooltip className="w-fit">
              {format(nextPlayerStartDate, 'dd MMMM y')}, at{' '}
              <span className="font-bold">
                {format(nextPlayerStartDate, 'hh:mm a')}
              </span>
            </Tooltip>
          </div>
        </div>
      </div>
    </div>
  );
}
