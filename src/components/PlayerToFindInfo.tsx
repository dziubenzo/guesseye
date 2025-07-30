'use client';

import TimeLeftTooltip from '@/components/TimeLeftTooltip';
import { useUpdateTimeLeft } from '@/lib/hooks';
import type { Schedule } from '@/lib/types';

type PlayerToFindInfoProps = {
  winnersCount: number;
  nextPlayerStartDate?: Schedule['startDate'];
};

export default function PlayerToFindInfo({
  winnersCount,
  nextPlayerStartDate,
}: PlayerToFindInfoProps) {
  return (
    <div
      className={`flex ${nextPlayerStartDate ? 'justify-between' : 'justify-end'} p-2`}
    >
      <div className="flex flex-col items-center p-2 rounded-md">
        <p>Guessed by</p>
        <p className="font-bold">
          {winnersCount} {winnersCount === 1 ? 'user' : 'users'}
        </p>
      </div>
      {nextPlayerStartDate && (
        <NextPlayerIn nextPlayerStartDate={nextPlayerStartDate} />
      )}
    </div>
  );
}

type NextPlayerInProps = {
  nextPlayerStartDate: Schedule['startDate'];
};

function NextPlayerIn({ nextPlayerStartDate }: NextPlayerInProps) {
  const { timeLeft } = useUpdateTimeLeft(nextPlayerStartDate);

  return (
    <div className="flex flex-col items-center p-2 rounded-md">
      <p>Next player in</p>
      <div className="relative">
        <p className="font-bold">{timeLeft}</p>
        <TimeLeftTooltip nextPlayerStartDate={nextPlayerStartDate} />
      </div>
    </div>
  );
}
