import CompletedGameAccessLayer from '@/components/CompletedGameAccessLayer';
import CompletedGameSkeleton from '@/components/skeletons/CompletedGameSkeletons';
import { Card, CardContent } from '@/components/ui/card';
import { db } from '@/server/db';
import { game } from '@/server/db/schema';
import { getSession } from '@/server/utils';
import { ne } from 'drizzle-orm';
import type { Metadata } from 'next';
import { Suspense, type ComponentProps } from 'react';

export const metadata: Metadata = { title: 'Completed Game' };

export async function generateStaticParams() {
  const completedGames = await db.query.game.findMany({
    columns: { id: true },
    where: ne(game.status, 'inProgress'),
  });

  return completedGames.map((game) => {
    return {
      gameId: game.id.toString(),
    };
  });
}

type CompletedGamePageProps = {
  params: Promise<{ gameId: string }>;
};

export default async function CompletedGamePage({
  params,
}: CompletedGamePageProps) {
  const sessionPromise = getSession();

  return (
    <CompletedGameWrapper>
      <Suspense fallback={<CompletedGameSkeleton />}>
        <CompletedGameAccessLayer
          sessionPromise={sessionPromise}
          paramsPromise={params}
        />
      </Suspense>
    </CompletedGameWrapper>
  );
}

function CompletedGameWrapper({ children, ...props }: ComponentProps<'div'>) {
  return (
    <div className="flex flex-col grow-1" {...props}>
      <Card className="grow-1 gap-3">
        <CardContent className="flex flex-col gap-8 text-sm/6 sm:text-base/6 px-2 sm:px-6">
          {children}
        </CardContent>
      </Card>
    </div>
  );
}
