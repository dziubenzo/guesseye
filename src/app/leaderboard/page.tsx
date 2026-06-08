import { columns } from '@/app/leaderboard/columns';
import DataTable from '@/app/official/data-table';
import TableSkeleton from '@/components/skeletons/TableSkeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { auth } from '@/lib/auth';
import { getLeaderboard } from '@/server/db/get-leaderboard';
import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';

export const metadata: Metadata = { title: 'Leaderboard' };

export default async function Leaderboard() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return notFound();
  }

  const leaderboardPromise = getLeaderboard(session.user.id);

  return (
    <div className="flex flex-col grow-1">
      <Card className="grow-1 gap-0">
        <CardHeader>
          <CardTitle className="text-2xl">Leaderboard</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 text-sm/6 sm:text-base/6">
          <div>
            <p>Here you can find the leaderboard.</p>
            <p>Every user is ranked based on (in that order):</p>
          </div>
          <ul className="list-disc list-inside">
            <li>Wins in official mode (descending);</li>
            <li>Wins in random mode (descending);</li>
            <li>Hints revealed (ascending);</li>
            <li>Give ups in official mode (ascending);</li>
            <li>Give ups in random mode (ascending).</li>
          </ul>
          <Suspense fallback={<TableSkeleton rows={8}/>}>
            <DataTable
              type="leaderboard"
              columns={columns}
              dataPromise={leaderboardPromise}
            />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}
