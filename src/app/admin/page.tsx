import Admin from '@/components/Admin';
import { Card } from '@/components/ui/card';
import { getSession } from '@/server/utils';
import type { Metadata } from 'next';
import { Suspense } from 'react';

export const metadata: Metadata = { title: 'Admin Page' };

export default async function AdminPage() {
  const sessionPromise = getSession();

  return (
    <div className="flex flex-col grow-1">
      <Card className="grow-1">
        <Suspense>
          <Admin sessionPromise={sessionPromise} />
        </Suspense>
      </Card>
    </div>
  );
}
