'use server';

import type { CompletedGame, ErrorObject } from '@/lib/types';
import { db } from '@/server/db/index';
import { game, guess } from '@/server/db/schema';
import { and, desc, eq, ne } from 'drizzle-orm';
import { unstable_cache } from 'next/cache';

export const getCompletedGame = async (gameId: string) => {
  const completedGameCache = unstable_cache(
    async () => {
      const completedGame = await db.query.game.findFirst({
        with: {
          user: { columns: { name: true } },
          guesses: {
            with: {
              player: true,
            },
            orderBy: desc(guess.id),
          },
          scheduledPlayer: {
            with: { playerToFind: true },
          },
          randomPlayer: true,
        },
        where: and(
          eq(game.id, parseInt(gameId)),
          ne(game.status, 'inProgress')
        ),
      });

      if (!completedGame) {
        const error: ErrorObject = {
          error: `No completed game found for game id ${gameId}.`,
        };
        return error;
      }

      const playerToFind =
        completedGame.randomPlayer ||
        completedGame.scheduledPlayer?.playerToFind;

      // Both if checks shouldn't ever happen
      if (!playerToFind) {
        const error: ErrorObject = {
          error: `No darts player to find for completed game with the id of ${completedGame.id}.`,
        };
        return error;
      }

      const completedGameStatus = completedGame.status;
      const completedGameTime = completedGame.endDate;

      if (completedGameStatus === 'inProgress' || !completedGameTime) {
        const error: ErrorObject = {
          error: `Game with the id of ${completedGame.id} is in progress.`,
        };
        return error;
      }

      const completedGameDetails: CompletedGame = {
        username: completedGame.user?.name ? completedGame.user.name : 'Guest',
        startDate: completedGame.startDate,
        endDate: completedGameTime,
        mode: completedGame.mode,
        status: completedGameStatus,
        hintsRevealed: completedGame.hintsRevealed,
        playerToFind: playerToFind,
        guesses: completedGame.guesses,
      };

      return completedGameDetails;
    },
    [`completedGame:${gameId}`],
    { tags: [`completedGame:${gameId}`] }
  );

  const completedGame = await completedGameCache();

  return completedGame;
};
