import { columns } from '@/app/history/columns';
import DataTable from '@/app/official/data-table';
import Bold from '@/components/Bold';
import TableSkeleton from '@/components/skeletons/TableSkeleton';
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Session } from '@/lib/auth';
import { getOfficialGamesHistory } from '@/server/db/get-official-games-history';
import { notFound } from 'next/navigation';
import { Suspense, use } from 'react';

type OfficialGamesHistoryProps = {
  sessionPromise: Promise<Session | null>;
};

export default function OfficialGamesHistory({
  sessionPromise,
}: OfficialGamesHistoryProps) {
  const session = use(sessionPromise);

  if (!session) {
    return notFound();
  }

  const historyPromise = getOfficialGamesHistory();

  return (
    <>
      <CardHeader>
        <CardTitle className="text-2xl">Official Games History</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3 text-sm/6 sm:text-base/6">
        <p>
          Here you can find winners of every official game by three categories:{' '}
          <Bold>first</Bold>, <Bold>fastest</Bold>, and{' '}
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
    </>
  );
}
