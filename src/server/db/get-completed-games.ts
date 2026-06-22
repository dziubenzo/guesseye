'use server';

import type { CompletedGameTable } from '@/lib/types';
import { db } from '@/server/db/index';
import { game } from '@/server/db/schema';
import { and, desc, eq, ne } from 'drizzle-orm';
import { cacheLife, cacheTag } from 'next/cache';

export const getCompletedGames = async (userId: string) => {
  'use cache';
  cacheLife('max');
  cacheTag(`completedGames:${userId}`);

  const completedGames = await db.query.game.findMany({
    with: {
      guesses: {
        columns: { id: true },
      },
      scheduledPlayer: {
        with: { playerToFind: true },
      },
      randomPlayer: true,
    },
    orderBy: desc(game.endDate),
    where: and(eq(game.userId, userId), ne(game.status, 'inProgress')),
  });

  const games: CompletedGameTable[] = [];

  for (let i = 0; i < completedGames.length; i++) {
    const playerToFind =
      completedGames[i].randomPlayer ||
      completedGames[i].scheduledPlayer?.playerToFind;

    // Both if checks shouldn't ever happen
    if (!playerToFind) {
      throw new Error(
        `No darts player to find for completed game with the id of ${completedGames[i].id}.`
      );
    }

    const completedGameStatus = completedGames[i].status;
    const completedGameTime = completedGames[i].endDate;

    if (completedGameStatus === 'inProgress' || !completedGameTime) {
      throw new Error(
        `Game with the id of ${completedGames[i].id} is in progress.`
      );
    }

    const game: CompletedGameTable = {
      gameId: completedGames[i].id,
      gameNo: completedGames.length - i,
      playerToFindName: playerToFind.firstName + ' ' + playerToFind.lastName,
      playerToFindDifficulty: playerToFind.difficulty,
      mode: completedGames[i].mode,
      endDate: completedGameTime,
      guessesCount: completedGames[i].guesses.length,
      status: completedGameStatus,
    };

    games.push(game);
  }

  return games;
};
