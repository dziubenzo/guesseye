import { columns } from '@/app/history/columns';
import DataTable from '@/app/official/data-table';
import Bold from '@/components/Bold';
import TableSkeleton from '@/components/skeletons/TableSkeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { auth } from '@/lib/auth';
import { getOfficialGamesHistory } from '@/server/db/get-official-games-history';
import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';

export const metadata: Metadata = { title: 'Official Games History' };

export default async function OfficialGamesHistory() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return notFound();
  }

  const historyPromise = getOfficialGamesHistory();

  return (
    <div className="flex flex-col grow-1">
      <Card className="grow-1 gap-0">
        <CardHeader>
          <CardTitle className="text-2xl">Official Games History</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 text-sm/6 sm:text-base/6">
          <p>
            Here you can find winners of every official game by three
            categories: <Bold>first</Bold>, <Bold>fastest</Bold>, and{' '}
            <Bold>fewest guesses</Bold>.
          </p>
          <Suspense fallback={<TableSkeleton />}>
            <DataTable
              type="officialGamesHistory"
              columns={columns}
              dataPromise={historyPromise}
            />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}
