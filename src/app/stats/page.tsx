import Bold from '@/components/Bold';
import GlobalStats from '@/components/GlobalStats';
import UserStats from '@/components/UserStats';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getGlobalStats } from '@/server/db/get-global-stats';
import { getUserStats } from '@/server/db/get-user-stats';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

export const metadata: Metadata = { title: 'Game Stats' };

export default async function Stats() {
  const [userStats, globalStats] = await Promise.all([
    getUserStats(),
    getGlobalStats(),
  ]);

  if ('error' in userStats || 'error' in globalStats) {
    return notFound();
  }

  return (
    <div className="flex flex-col grow-1 justify-center">
      <Card className="grow-1 gap-0">
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
            <TabsContent value="user">
              <UserStats stats={userStats} />
            </TabsContent>
            <TabsContent value="global">
              <GlobalStats stats={globalStats} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
