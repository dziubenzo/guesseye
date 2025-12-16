'use server';

import Message from '@/components/Message';
import PlayerSchedulerForm from '@/components/PlayerSchedulerForm';
import { Separator } from '@/components/ui/separator';
import type { ErrorObject, PlayerAdmin, Schedule } from '@/lib/types';
import { format, formatDistanceToNowStrict } from 'date-fns';

type PlayerSchedulerProps = {
  players: PlayerAdmin[];
  lastScheduledPlayer: ErrorObject | Schedule;
};

export default async function PlayerScheduler({
  players,
  lastScheduledPlayer,
}: PlayerSchedulerProps) {
  if ('error' in lastScheduledPlayer) {
    return (
      <div className="flex flex-col gap-4">
        <h1 className="text-xl font-medium">Schedule Player</h1>
        <Message type="error">
          <p>{lastScheduledPlayer.error}</p>
        </Message>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-xl font-medium">Schedule Player</h1>
      <p>Last official mode player is scheduled for:</p>
      <p className="text-md font-medium">
        {format(lastScheduledPlayer.startDate, 'dd MMMM y')} (
        {formatDistanceToNowStrict(lastScheduledPlayer.startDate, {
          addSuffix: true,
        })}
        )
      </p>
      <Separator />
      <p>
        Schedule player for{' '}
        <span className="font-medium">
          {format(lastScheduledPlayer.endDate, 'dd MMMM y')}
        </span>
      </p>
      <PlayerSchedulerForm
        players={players}
        startDate={lastScheduledPlayer.endDate}
      />
    </div>
  );
}
