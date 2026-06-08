import { columns } from '@/app/games/columns';
import DataTable from '@/app/official/data-table';
import TableSkeleton from '@/components/skeletons/TableSkeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { auth } from '@/lib/auth';
import { getCompletedGames } from '@/server/db/get-completed-games';
import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';

export const metadata: Metadata = { title: 'Game History' };

export default async function GameHistory() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return notFound();
  }

  const gamesPromise = getCompletedGames(session.user.id);

  return (
    <div className="flex flex-col grow-1">
      <Card className="grow-1 gap-0">
        <CardHeader>
          <CardTitle className="text-2xl">Game History</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 text-sm/6 sm:text-base/6">
          <p>Here you can see all of your completed games.</p>
          <p>
            Click or tap the Details button next to a game to see your previous
            guesses as well as all information on the darts player to find.
          </p>
          <Suspense fallback={<TableSkeleton />}>
            <DataTable
              type="gameHistory"
              columns={columns}
              dataPromise={gamesPromise}
            />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}
