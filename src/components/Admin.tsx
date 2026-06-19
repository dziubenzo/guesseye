import AddHint from '@/components/AddHint';
import PlayerScheduler from '@/components/PlayerScheduler';
import SuggestedHintsSkeleton from '@/components/skeletons/SuggestedHintsSkeleton';
import SuggestedHints from '@/components/SuggestedHints';
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import UpdateButtons from '@/components/UpdateButtons';
import type { Session } from '@/lib/auth';
import { getLastScheduledPlayer } from '@/server/db/get-last-scheduled-player';
import { getPlayersAddHint } from '@/server/db/get-players-add-hint';
import { getPlayersSchedulePlayer } from '@/server/db/get-players-schedule-player';
import { getSuggestedHints } from '@/server/db/get-suggested-hints';
import { notFound } from 'next/navigation';
import { Suspense, use } from 'react';

type AdminProps = {
  sessionPromise: Promise<Session | null>;
};

export default function Admin({ sessionPromise }: AdminProps) {
  const session = use(sessionPromise);

  if (!session || session.user.role === 'user') {
    return notFound();
  }

  const playersAddHintPromise = getPlayersAddHint();
  const playersSchedulePlayerPromise = getPlayersSchedulePlayer();
  const lastScheduledPlayerPromise = getLastScheduledPlayer();
  const suggestedHintsPromise = getSuggestedHints();

  return (
    <>
      <CardHeader>
        <CardTitle className="text-2xl">Admin Page</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 grow-1">
        <UpdateButtons />
        <Separator />
        <PlayerScheduler
          playersPromise={playersSchedulePlayerPromise}
          lastScheduledPlayerPromise={lastScheduledPlayerPromise}
        />
        <Separator />
        <AddHint playersPromise={playersAddHintPromise} />
        <Separator />
        <Suspense fallback={<SuggestedHintsSkeleton />}>
          <SuggestedHints suggestedHintsPromise={suggestedHintsPromise} />
        </Suspense>
      </CardContent>
    </>
  );
}
