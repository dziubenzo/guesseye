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

export default async function Stats() {
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
            <TabsList className="w-full">
              <TabsTrigger className="cursor-pointer" value="user">
                You
              </TabsTrigger>
              <TabsTrigger className="cursor-pointer" value="global">
                Global
              </TabsTrigger>
            </TabsList>
            <TabsContent value="user">
              <UserStats />
            </TabsContent>
            <TabsContent value="global">
              <GlobalStats />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
