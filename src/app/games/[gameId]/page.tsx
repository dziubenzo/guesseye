import CompletedGame from '@/components/CompletedGame';
import CompletedGameSkeleton from '@/components/skeletons/CompletedGameSkeletons';
import { Card, CardContent } from '@/components/ui/card';
import { auth } from '@/lib/auth';
import { db } from '@/server/db';
import { getCompletedGame } from '@/server/db/get-completed-game';
import { game } from '@/server/db/schema';
import { ne } from 'drizzle-orm';
import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { notFound } from 'next/navigation';
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

export default async function CompletedGamePage({
  params,
}: {
  params: Promise<{ gameId: string }>;
}) {
  const [session, { gameId }] = await Promise.all([
    auth.api.getSession({
      headers: await headers(),
    }),
    params,
  ]);

  if (!session) {
    return notFound();
  }

  const completedGamePromise = getCompletedGame(gameId);

  return (
    <CompletedGameWrapper>
      <Suspense fallback={<CompletedGameSkeleton />}>
        <CompletedGame
          gameId={gameId}
          completedGamePromise={completedGamePromise}
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
