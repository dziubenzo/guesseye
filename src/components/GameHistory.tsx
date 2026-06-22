import { columns } from '@/app/games/columns';
import DataTable from '@/app/official/data-table';
import TableSkeleton from '@/components/skeletons/TableSkeleton';
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Session } from '@/lib/auth';
import { getCompletedGames } from '@/server/db/get-completed-games';
import { notFound } from 'next/navigation';
import { Suspense, use } from 'react';

type GameHistoryProps = {
  sessionPromise: Promise<Session | null>;
};

export default function GameHistory({ sessionPromise }: GameHistoryProps) {
  const session = use(sessionPromise);

  if (!session) {
    return notFound();
  }

  const completedGamesPromise = getCompletedGames(session.user.id);

  return (
    <>
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
            dataPromise={completedGamesPromise}
          />
        </Suspense>
      </CardContent>
    </>
  );
}
