import BirthdayPlayers from '@/components/BirthdayPlayers';
import DatabaseStatsCharts from '@/components/DatabaseStatsCharts';
import {
  BirthdayPlayersSkeleton,
  DatabaseStatsSkeleton,
} from '@/components/skeletons/DatabaseStatsSkeleton';
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Session } from '@/lib/auth';
import { getBirthdayPlayers } from '@/server/db/get-birthday-players';
import { getDatabaseStats } from '@/server/db/get-database-stats';
import { notFound } from 'next/navigation';
import { Suspense, use } from 'react';

type DatabaseStatsProps = {
  sessionPromise: Promise<Session | null>;
};

export default function DatabaseStats({ sessionPromise }: DatabaseStatsProps) {
  const session = use(sessionPromise);

  if (!session) {
    return notFound();
  }

  const birthdayPlayersPromise = getBirthdayPlayers();
  const statsPromise = getDatabaseStats();

  return (
    <>
      <CardHeader>
        <CardTitle className="text-2xl">Database Stats</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3 grow-1 text-sm/6 sm:text-base/6">
        <p>
          Here you can take a look at various database stats as well as find out
          which darts players celebrate their birthday today.
        </p>
        <div className="flex flex-col gap-4 sm:gap-8">
          <Suspense fallback={<BirthdayPlayersSkeleton />}>
            <BirthdayPlayers birthdayPlayersPromise={birthdayPlayersPromise} />
          </Suspense>
          <Suspense fallback={<DatabaseStatsSkeleton />}>
            <DatabaseStatsCharts statsPromise={statsPromise} />
          </Suspense>
        </div>
      </CardContent>
    </>
  );
}
