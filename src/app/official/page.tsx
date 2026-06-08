import { columns } from '@/app/official/columns';
import DataTable from '@/app/official/data-table';
import Bold from '@/components/Bold';
import TableSkeleton from '@/components/skeletons/TableSkeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { auth } from '@/lib/auth';
import { getOfficialGames } from '@/server/db/get-official-games';
import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';

export const metadata: Metadata = { title: 'Official Games' };

export default async function OfficialGames() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return notFound();
  }

  const officialGamesPromise = getOfficialGames(session.user.id);

  return (
    <div className="flex flex-col grow-1">
      <Card className="grow-1 gap-0">
        <CardHeader>
          <CardTitle className="text-2xl">Official Games</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 text-sm/6 sm:text-base/6">
          <div>
            <p>Here you can find all official games.</p>
            <p>
              If you haven&apos;t played or finished some of the games, you can
              either <Bold>start playing</Bold> or <Bold>resume</Bold> them.
            </p>
          </div>
          <Suspense fallback={<TableSkeleton />}>
            <DataTable
              type="officialGames"
              columns={columns}
              dataPromise={officialGamesPromise}
            />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}
