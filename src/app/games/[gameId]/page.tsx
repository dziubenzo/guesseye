import ErrorPage from '@/components/ErrorPage';
import GameDetail from '@/components/GameDetail';
import GameDetailsPlayers from '@/components/GameDetailsPlayers';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { auth } from '@/lib/auth';
import { capitalise } from '@/lib/utils';
import { db } from '@/server/db';
import { getCompletedGameDetails } from '@/server/db/get-completed-game-details';
import { game } from '@/server/db/schema';
import { format } from 'date-fns';
import { ne } from 'drizzle-orm';
import type { Metadata } from 'next';
import { headers } from 'next/headers';
import Link from 'next/link';
import { notFound } from 'next/navigation';

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

export default async function CompletedGame({
  params,
}: {
  params: Promise<{ gameId: string }>;
}) {
  const { gameId } = await params;
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return notFound();
  }

  const gameDetails = await getCompletedGameDetails(gameId);

  if ('error' in gameDetails) {
    return <ErrorPage errorMessage={gameDetails.error} />;
  }

  const {
    endDate,
    guesses,
    hintsRevealed,
    mode,
    playerToFind,
    startDate,
    status,
    username,
  } = gameDetails;

  return (
    <div className="flex flex-col grow-1">
      <Card className="grow-1 gap-3">
        <CardContent className="flex flex-col gap-8 text-sm/6 sm:text-base/6 px-2 sm:px-6">
          <div className="flex justify-center sm:justify-end sticky top-2 z-1">
            <Button className="cursor-pointer" variant="default" asChild>
              <Link href="/games">Back to Game History</Link>
            </Button>
          </div>
          <div className="grid text-center sm:grid-cols-2 gap-2">
            <GameDetail title="Game No.">{gameId}</GameDetail>
            <GameDetail title="Completed By">{username}</GameDetail>
            <GameDetail title="Game Mode">{capitalise(mode)}</GameDetail>
            <GameDetail
              title="Game Status"
              className={
                status === 'won'
                  ? 'text-good-guess dark:text-good-guess'
                  : 'text-wrong-guess dark:text-wrong-guess'
              }
            >
              {status === 'won' ? 'Won' : 'Given Up'}
            </GameDetail>
            <GameDetail title="Started At">
              {format(startDate, 'HH:mm')} ({format(startDate, 'dd MMM y')})
            </GameDetail>
            <GameDetail title="Completed At">
              {format(endDate, 'HH:mm')} ({format(endDate, 'dd MMM y')})
            </GameDetail>
            <GameDetail title="Guesses Made">{guesses.length}</GameDetail>
            <GameDetail title="Hints Revealed">{hintsRevealed}</GameDetail>
          </div>
          <GameDetailsPlayers playerToFind={playerToFind} guesses={guesses} />
        </CardContent>
      </Card>
    </div>
  );
}
