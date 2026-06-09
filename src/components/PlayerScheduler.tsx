import { PlayerSchedulerFormWrapper } from '@/components/PlayerSchedulerForm';
import PlayerSchedulerTop from '@/components/PlayerSchedulerTop';
import PlayerSchedulerSkeleton from '@/components/skeletons/PlayerSchedulerSkeleton';
import type { ErrorObject, PlayerAdmin, Schedule } from '@/lib/types';
import { Suspense } from 'react';

type PlayerSchedulerProps = {
  playersPromise: Promise<PlayerAdmin[]>;
  lastScheduledPlayerPromise: Promise<ErrorObject | Schedule>;
};

export default function PlayerScheduler({
  playersPromise,
  lastScheduledPlayerPromise,
}: PlayerSchedulerProps) {
  return (
    <div className="flex flex-col gap-4">
      <Suspense fallback={<PlayerSchedulerSkeleton />}>
        <PlayerSchedulerTop
          lastScheduledPlayerPromise={lastScheduledPlayerPromise}
        />
        <PlayerSchedulerFormWrapper
          playersPromise={playersPromise}
          lastScheduledPlayerPromise={lastScheduledPlayerPromise}
        />
      </Suspense>
    </div>
  );
}
