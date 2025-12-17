import AddHint from '@/components/AddHint';
import PlayerScheduler from '@/components/PlayerScheduler';
import SuggestedHints from '@/components/SuggestedHints';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import UpdateButtons from '@/components/UpdateButtons';
import { auth } from '@/lib/auth';
import { getLastScheduledPlayer } from '@/server/db/get-last-scheduled-player';
import { getPlayersAdmin } from '@/server/db/get-players-admin';
import { getSuggestedHints } from '@/server/db/get-suggested-hints';
import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { notFound } from 'next/navigation';

export const metadata: Metadata = { title: 'Admin Page' };

export default async function Admin() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || session.user.role === 'user') {
    return notFound();
  }

  const [players, lastScheduledPlayer, suggestedHints] = await Promise.all([
    getPlayersAdmin(),
    getLastScheduledPlayer(),
    getSuggestedHints(),
  ]);

  return (
    <div className="flex flex-col grow-1 justify-center">
      <Card className="grow-1">
        <CardHeader>
          <CardTitle className="text-2xl">Admin Page</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 grow-1">
          <UpdateButtons />
          <Separator />
          <PlayerScheduler
            players={players}
            lastScheduledPlayer={lastScheduledPlayer}
          />
          <Separator />
          <AddHint players={players} />
          <Separator />
          <SuggestedHints hints={suggestedHints} />
        </CardContent>
      </Card>
    </div>
  );
}
