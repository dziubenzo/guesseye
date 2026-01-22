'use server';

import type { CompletedGame, ErrorObject } from '@/lib/types';
import { db } from '@/server/db/index';
import { game, guess } from '@/server/db/schema';
import { and, asc, desc, eq, ne } from 'drizzle-orm';
import { unstable_cache } from 'next/cache';

export const getUserCompletedGames = unstable_cache(
  async (userId: string) => {
    const completedGames = await db.query.game.findMany({
      with: {
        guesses: {
          with: {
            player: true,
          },
          orderBy: asc(guess.id),
        },
        scheduledPlayer: {
          with: { playerToFind: true },
        },
        randomPlayer: true,
      },
      orderBy: desc(game.endDate),
      where: and(eq(game.userId, userId), ne(game.status, 'inProgress')),
    });

    const games: CompletedGame[] = [];

    for (let i = 0; i < completedGames.length; i++) {
      const playerToFind =
        completedGames[i].randomPlayer ||
        completedGames[i].scheduledPlayer?.playerToFind;

      // This shouldn't even happen
      if (!playerToFind) {
        const error: ErrorObject = {
          error: `No darts player to find for completed game with id ${completedGames[i].id}.`,
        };
        return error;
      }

      const game: CompletedGame = {
        gameNo: completedGames.length - i,
        startDate: completedGames[i].startDate,
        endDate: completedGames[i].endDate,
        mode: completedGames[i].mode,
        status: completedGames[i].status,
        hintsRevealed: completedGames[i].hintsRevealed,
        playerToFind: playerToFind,
        guesses: completedGames[i].guesses,
      };

      games.push(game);
    }

    return games;
  },
  [],
  { tags: ['completedGames'] }
);
