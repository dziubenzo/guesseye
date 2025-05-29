'use server';

import { auth } from '@/lib/auth';
import type { ErrorObject, Leaderboard } from '@/lib/types';
import {
  countGames,
  findFastestWin,
  findWinWithFewestGuesses,
  sortByWinsAndGiveUps,
} from '@/lib/utils';
import { db } from '@/server/db/index';
import { headers } from 'next/headers';

export const getLeaderboard = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    const error: ErrorObject = { error: 'Please log in first.' };
    return error;
  }

  // Get all users with their games and guesses
  const users = await db.query.user.findMany({
    columns: { name: true },
    with: {
      games: {
        with: { guesses: true },
      },
    },
  });

  const data = users
    .map((user) => {
      const leaderboardUser: Leaderboard = {
        username: user.name,
        officialModeWins: 0,
        officialModeGiveUps: 0,
        randomModeWins: 0,
        randomModeGiveUps: 0,
        gamesInProgress: 0,
        fastestWin: undefined,
        fewestGuesses: undefined,
      };

      if (user.games.length > 0) {
        user.games.forEach((game) => {
          countGames(game, leaderboardUser);

          if (game.gameMode === 'random' || game.hasGivenUp || !game.hasWon) {
            return;
          }

          findFastestWin(game, leaderboardUser);
          findWinWithFewestGuesses(game, leaderboardUser);
        });
      }

      return leaderboardUser;
    })
    .sort(sortByWinsAndGiveUps);

  return data;
};
