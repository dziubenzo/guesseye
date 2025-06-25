'use server';

import { auth } from '@/lib/auth';
import type { ErrorObject, OfficialGamesHistory } from '@/lib/types';
import {
  findFastestWinner,
  findFirstWinner,
  findWinnerWithFewestGuesses,
} from '@/lib/utils';
import { db } from '@/server/db/index';
import { game, schedule } from '@/server/db/schema';
import { desc, eq, lt } from 'drizzle-orm';
import { headers } from 'next/headers';

export const getOfficialGamesHistory = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    const error: ErrorObject = { error: 'Please log in first.' };
    return error;
  }

  // Get all previous scheduled players up to the current one along with games with guesses and user if it exists
  const scheduleRows = await db.query.schedule.findMany({
    where: lt(schedule.startDate, new Date()),
    with: {
      playerToFind: true,
      games: {
        where: eq(game.mode, 'official'),
        with: { guesses: true, user: true },
      },
    },
    orderBy: desc(schedule.startDate),
  });

  const data = scheduleRows.map((scheduledPlayer, index) => {
    const history: OfficialGamesHistory = {
      gameNo: scheduleRows.length - index,
      startDate: scheduledPlayer.startDate,
      endDate: scheduledPlayer.endDate,
      playerDifficulty: scheduledPlayer.playerToFind.difficulty,
      winners: 0,
      firstWinner: undefined,
      firstWinnerTime: undefined,
      fastestWinner: undefined,
      fastestWinnerDuration: undefined,
      winnerWithFewestGuesses: undefined,
      winnerGuesses: undefined,
    };

    if (scheduledPlayer.games.length > 0) {
      scheduledPlayer.games.forEach((game) => {
        if (!game.hasWon || game.hasGivenUp) return;

        history.winners++;
        findFirstWinner(game, history, scheduledPlayer.startDate);
        findFastestWinner(game, history);
        findWinnerWithFewestGuesses(game, history);
      });
    }

    return history;
  });

  return data;
};
