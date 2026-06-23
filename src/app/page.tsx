import CurrentGame from '@/components/CurrentGame';
import GamePageSkeleton from '@/components/skeletons/GamePageSkeletons';
import { getSession } from '@/server/utils';
import type { Metadata } from 'next';
import { Suspense } from 'react';

export const metadata: Metadata = { title: 'GuessEye' };

export default async function CurrentGamePage() {
  const sessionPromise = getSession();

  return (
    <Suspense fallback={<GamePageSkeleton isOfficialGame/>}>
      <CurrentGame sessionPromise={sessionPromise} />
    </Suspense>
  );
}
