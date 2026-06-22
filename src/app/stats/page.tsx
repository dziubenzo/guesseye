import Stats from '@/components/Stats';
import { Card } from '@/components/ui/card';
import { getSession } from '@/server/utils';
import type { Metadata } from 'next';
import { Suspense } from 'react';

export const metadata: Metadata = { title: 'Game Stats' };

export default async function StatsPage() {
  const sessionPromise = getSession();

  return (
    <div className="flex flex-col grow-1 justify-center">
      <Card className="grow-1 gap-0">
        <Suspense>
          <Stats sessionPromise={sessionPromise} />
        </Suspense>
      </Card>
    </div>
  );
}
