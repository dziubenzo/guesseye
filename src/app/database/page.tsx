import BirthdayPlayers from '@/components/BirthdayPlayers';
import DatabaseStats from '@/components/DatabaseStats';
import {
  BirthdayPlayersSkeleton,
  DatabaseStatsSkeleton,
} from '@/components/skeletons/DatabaseStatsSkeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { auth } from '@/lib/auth';
import { getBirthdayPlayers } from '@/server/db/get-birthday-players';
import { getDatabaseStats } from '@/server/db/get-database-stats';
import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';

export const metadata: Metadata = { title: 'Database Stats' };

export default async function DatabaseStatsPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return notFound();
  }

  const birthdayPlayersPromise = getBirthdayPlayers();
  const statsPromise = getDatabaseStats();

  return (
    <div className="flex flex-col grow-1">
      <Card className="grow-1 gap-0">
        <CardHeader>
          <CardTitle className="text-2xl">Database Stats</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 grow-1 text-sm/6 sm:text-base/6">
          <p>
            Here you can take a look at various database stats as well as find
            out which darts players celebrate their birthday today.
          </p>
          <div className="flex flex-col gap-4 sm:gap-8">
            <Suspense fallback={<BirthdayPlayersSkeleton />}>
              <BirthdayPlayers
                birthdayPlayersPromise={birthdayPlayersPromise}
              />
            </Suspense>
            <Suspense fallback={<DatabaseStatsSkeleton />}>
              <DatabaseStats statsPromise={statsPromise} />
            </Suspense>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
