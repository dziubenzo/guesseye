import Settings from '@/components/Settings';
import { Card } from '@/components/ui/card';
import { getSession } from '@/server/utils';
import type { Metadata } from 'next';
import { Suspense } from 'react';

export const metadata: Metadata = { title: 'Settings' };

export default async function SettingsPage() {
  const sessionPromise = getSession();

  return (
    <div className="flex flex-col grow-1">
      <Card className="grow-1 gap-0">
        <Suspense>
          <Settings sessionPromise={sessionPromise} />
        </Suspense>
      </Card>
    </div>
  );
}
