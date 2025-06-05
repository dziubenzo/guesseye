import GlobalStats from '@/components/GlobalStats';
import UserStats from '@/components/UserStats';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getGlobalStats } from '@/server/db/get-global-stats';
import { getUserStats } from '@/server/db/get-user-stats';
import { notFound } from 'next/navigation';

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
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Stats</CardTitle>
          <CardDescription>
            <p>Here you can find your game stats as well as global stats.</p>
          </CardDescription>
        </CardHeader>
        <CardContent>
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
