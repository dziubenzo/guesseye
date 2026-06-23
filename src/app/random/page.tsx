import RandomGame from '@/components/RandomGame';
import GamePageSkeleton from '@/components/skeletons/GamePageSkeletons';
import { getSession } from '@/server/utils';
import type { Metadata } from 'next';
import { Suspense } from 'react';

export const metadata: Metadata = { title: 'Random Game' };

export default async function RandomGamePage() {
  const sessionPromise = getSession();

  return (
    <Suspense fallback={<GamePageSkeleton />}>
      <RandomGame sessionPromise={sessionPromise} />
    </Suspense>
  );
}
