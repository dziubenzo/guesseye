import Leaderboard from '@/components/Leaderboard';
import { Card } from '@/components/ui/card';
import { getSession } from '@/server/utils';
import type { Metadata } from 'next';
import { Suspense } from 'react';

export const metadata: Metadata = { title: 'Leaderboard' };

export default async function LeaderboardPage() {
  const sessionPromise = getSession();

  return (
    <div className="flex flex-col grow-1">
      <Card className="grow-1 gap-0">
        <Suspense>
          <Leaderboard sessionPromise={sessionPromise} />
        </Suspense>
      </Card>
    </div>
  );
}
