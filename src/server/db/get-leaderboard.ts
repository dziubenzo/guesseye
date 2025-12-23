'use server';

import { auth } from '@/lib/auth';
import type { ErrorObject, LeaderboardUser } from '@/lib/types';
import {
  countGames,
  findFastestWin,
  findWinWithFewestGuesses,
  sortLeaderboardUsers,
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
    columns: { id: true, name: true },
    with: {
      games: {
        with: { guesses: true },
      },
    },
  });

  const leaderboard = users
    .map((user) => {
      const leaderboardUser: LeaderboardUser = {
        username: user.name,
        isCurrentUser: user.id === session.user.id ? true : false,
        officialModeWins: 0,
        officialModeGiveUps: 0,
        randomModeWins: 0,
        randomModeGiveUps: 0,
        gamesInProgress: 0,
        hintsRevealed: 0,
        fastestWin: undefined,
        fewestGuesses: undefined,
      };

      if (user.games.length > 0) {
        user.games.forEach((game) => {
          countGames(game, leaderboardUser);
          leaderboardUser.hintsRevealed += game.hintsRevealed;

          if (game.mode === 'official' && game.status === 'won') {
            leaderboardUser.fastestWin = findFastestWin(
              game,
              leaderboardUser.fastestWin
            );
            findWinWithFewestGuesses(game, leaderboardUser);
          }
        });
      }

      return leaderboardUser;
    })
    .sort(sortLeaderboardUsers);

  return leaderboard;
};
