import Message from '@/components/Message';
import type { ErrorObject, Schedule } from '@/lib/types';
import { format, formatDistanceToNowStrict } from 'date-fns';
import { use } from 'react';

type PlayerSchedulerProps = {
  lastScheduledPlayerPromise: Promise<ErrorObject | Schedule>;
};

export default function PlayerSchedulerTop({
  lastScheduledPlayerPromise,
}: PlayerSchedulerProps) {
  const lastScheduledPlayer = use(lastScheduledPlayerPromise);

  return (
    <>
      <h1 className="text-xl font-medium">Schedule Player</h1>
      {'error' in lastScheduledPlayer ? (
        <Message type="error">
          <p>{lastScheduledPlayer.error}</p>
        </Message>
      ) : (
        <>
          <p>Last official mode player is scheduled for:</p>
          <p className="text-md font-medium">
            {format(lastScheduledPlayer.startDate, 'dd MMMM y')} (
            {formatDistanceToNowStrict(lastScheduledPlayer.startDate, {
              addSuffix: true,
            })}
            )
          </p>
        </>
      )}
    </>
  );
}
