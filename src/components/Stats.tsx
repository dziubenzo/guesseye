import Bold from '@/components/Bold';
import GlobalStats from '@/components/GlobalStats';
import StatsSkeleton from '@/components/skeletons/StatsSkeleton';
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import UserStats from '@/components/UserStats';
import type { Session } from '@/lib/auth';
import { getGlobalStats } from '@/server/db/get-global-stats';
import { getUserStats } from '@/server/db/get-user-stats';
import { notFound } from 'next/navigation';
import { Suspense, use } from 'react';

type StatsProps = {
  sessionPromise: Promise<Session | null>;
};

export default function Stats({ sessionPromise }: StatsProps) {
  const session = use(sessionPromise);

  if (!session) {
    return notFound();
  }

  const userStatsPromise = getUserStats(session.user.id);
  const globalStatsPromise = getGlobalStats();

  return (
    <>
      <CardHeader>
        <CardTitle className="text-2xl">Stats</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3 text-sm/6 sm:text-base/6">
        <p>
          Here you can find <Bold>your</Bold> game stats as well as{' '}
          <Bold>global</Bold> stats.
        </p>
        <Tabs defaultValue="user">
          <TabsList className="bg-transparent w-full md:min-h-14">
            <TabsTrigger
              className="cursor-pointer bg-transparent text-card-foreground data-[state=active]:bg-primary data-[state=active]:text-primary-foreground dark:data-[state=active]:bg-primary dark:data-[state=active]:text-primary-foreground data-[state=inactive]:text-card-foreground md:text-lg"
              value="user"
            >
              You
            </TabsTrigger>
            <TabsTrigger
              className="cursor-pointer bg-transparent text-card-foreground data-[state=active]:bg-primary data-[state=active]:text-primary-foreground dark:data-[state=active]:bg-primary dark:data-[state=active]:text-primary-foreground data-[state=inactive]:text-card-foreground md:text-lg"
              value="global"
            >
              Global
            </TabsTrigger>
          </TabsList>
          <Suspense fallback={<StatsSkeleton />}>
            <TabsContent value="user">
              <UserStats statsPromise={userStatsPromise} />
            </TabsContent>
            <TabsContent value="global">
              <GlobalStats statsPromise={globalStatsPromise} />
            </TabsContent>
          </Suspense>
        </Tabs>
      </CardContent>
    </>
  );
}
