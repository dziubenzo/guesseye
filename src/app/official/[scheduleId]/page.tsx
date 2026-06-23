import OfficialGame from '@/components/OfficialGame';
import GamePageSkeleton from '@/components/skeletons/GamePageSkeletons';
import { getSession } from '@/server/utils';
import type { Metadata } from 'next';
import { Suspense } from 'react';

export const metadata: Metadata = { title: 'Official Game' };

type OfficialGamePageProps = {
  params: Promise<{ scheduleId: string }>;
};

export default async function OfficialGamePage({
  params,
}: OfficialGamePageProps) {
  const sessionPromise = getSession();

  return (
    <Suspense fallback={<GamePageSkeleton isOfficialGame />}>
      <OfficialGame sessionPromise={sessionPromise} paramsPromise={params} />
    </Suspense>
  );
}
