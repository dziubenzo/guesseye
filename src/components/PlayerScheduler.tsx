'use server';

import Message from '@/components/Message';
import PlayerSchedulerForm from '@/components/PlayerSchedulerForm';
import { Separator } from '@/components/ui/separator';
import { getLastScheduledPlayer } from '@/server/db/get-last-scheduled-player';
import { getPlayersWithCount } from '@/server/db/get-players-with-count';
import { format, formatDistanceToNowStrict } from 'date-fns';

export default async function PlayerScheduler() {
  const playersWithCount = await getPlayersWithCount();
  const lastScheduledPlayer = await getLastScheduledPlayer();

  if ('error' in lastScheduledPlayer) {
    return (
      <div className="flex flex-col gap-4">
        <h1 className="text-xl font-medium">Schedule Players</h1>
        <Message type="error" message={lastScheduledPlayer.error} />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-xl font-medium">Schedule Players</h1>
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
        players={playersWithCount}
        startDate={lastScheduledPlayer.endDate}
      />
    </div>
  );
}
