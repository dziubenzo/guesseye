import HeaderMenu from '@/components/HeaderMenu';
import HeaderSkeleton from '@/components/skeletons/HeaderSkeleton';
import { getSession } from '@/server/utils';
import { Suspense } from 'react';

export default async function Header() {
  const sessionPromise = getSession();

  return (
    <Suspense fallback={<HeaderSkeleton />}>
      <HeaderMenu sessionPromise={sessionPromise} />
    </Suspense>
  );
}
