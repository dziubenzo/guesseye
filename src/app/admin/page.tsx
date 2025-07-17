import PlayerScheduler from '@/components/PlayerScheduler';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import UpdateButtons from '@/components/UpdateButtons';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { notFound } from 'next/navigation';

export default async function Admin() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || session.user.role === 'user') {
    return notFound();
  }

  return (
    <div className="flex flex-col grow-1 justify-center">
      <Card className="grow-1">
        <CardHeader>
          <CardTitle className="text-2xl">Admin Page</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 grow-1">
          <UpdateButtons />
          <Separator />
          <PlayerScheduler />
        </CardContent>
      </Card>
    </div>
  );
}
