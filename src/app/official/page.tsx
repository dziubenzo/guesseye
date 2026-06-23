import OfficialGames from '@/components/OfficialGames';
import { Card } from '@/components/ui/card';
import { getSession } from '@/server/utils';
import type { Metadata } from 'next';
import { Suspense } from 'react';

export const metadata: Metadata = { title: 'Official Games' };

export default async function OfficialGamesPage() {
  const sessionPromise = getSession();

  return (
    <div className="flex flex-col grow-1">
      <Card className="grow-1 gap-0">
        <Suspense>
          <OfficialGames sessionPromise={sessionPromise} />
        </Suspense>
      </Card>
    </div>
  );
}
