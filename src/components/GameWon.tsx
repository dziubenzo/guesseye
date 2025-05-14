'use client';

import Tooltip from '@/components/Tooltip';
import { Separator } from '@/components/ui/separator';
import { useUpdateTimeLeft } from '@/lib/hooks';
import type { GameWon as GameWonType } from '@/lib/types';
import { format } from 'date-fns';
import { Trophy } from 'lucide-react';

type GameWonProps = {
  previousGame: GameWonType;
};

export default function GameWon({ previousGame }: GameWonProps) {
  const { attempts, fullName, nextPlayerDifficulty, nextPlayerStartDate } =
    previousGame;
  const { timeLeft, timeInSeconds } = useUpdateTimeLeft(nextPlayerStartDate);

  return (
    <div className="flex flex-col grow-1 justify-center text-center items-center gap-4">
      <Trophy size={128} className="opacity-80 hover:animate-pulse" />
      <p>You found</p>
      <p className="text-xl lg:text-2xl bg-foreground text-background px-8 py-2 rounded-md">
        {fullName}
      </p>
      <p>in</p>
      <p className="text-xl lg:text-2xl bg-foreground text-background px-8 py-2 rounded-md">
        {attempts}
      </p>
      <p>{attempts === 1 ? 'try' : 'tries.'}</p>
      <Separator />
      <p>The next darts player unlocks in</p>
      <div className="flex gap-2 items-start relative">
        <p
          className="text-xl lg:text-2xl bg-foreground text-background px-6 py-2 rounded-md"
          suppressHydrationWarning
        >
          {timeLeft}{' '}
        </p>
        <div className="absolute -top-2 -right-4">
          <Tooltip className="w-fit">
            {format(nextPlayerStartDate, 'dd MMMM y')}, at{' '}
            <span className="font-bold">
              {format(nextPlayerStartDate, 'hh:mm a')}
            </span>
          </Tooltip>
        </div>
      </div>
      <p>or</p>
      <p
        className="text-xl lg:text-2xl bg-foreground text-background px-8 py-2 rounded-md"
        suppressHydrationWarning
      >
        {timeInSeconds}
      </p>
      <p> {timeInSeconds === 1 ? 'second' : 'seconds'}</p>
      <p>and their difficulty is</p>
      <p className="text-xl lg:text-2xl bg-foreground text-background px-8 py-2 rounded-md">
        {nextPlayerDifficulty}
      </p>
    </div>
  );
}
