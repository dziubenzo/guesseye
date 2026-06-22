'use server';

import type { OfficialGamesHistory } from '@/lib/types';
import {
  findFastestWinner,
  findFirstWinner,
  findWinnerWithFewestGuesses,
} from '@/lib/utils';
import { db } from '@/server/db/index';
import { schedule } from '@/server/db/schema';
import { desc, lt } from 'drizzle-orm';

export const getOfficialGamesHistory = async () => {
  // Get all previous scheduled players up to the current one along with games with guesses and user
  const scheduleRows = await db.query.schedule.findMany({
    where: lt(schedule.startDate, new Date()),
    with: {
      playerToFind: true,
      games: {
        with: { guesses: true, user: true },
      },
    },
    orderBy: desc(schedule.startDate),
  });

  const history = scheduleRows.map((scheduledPlayer, index) => {
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
        if (game.status === 'won') {
          history.winners++;
          findFirstWinner(game, history, scheduledPlayer.startDate);
          findFastestWinner(game, history);
          findWinnerWithFewestGuesses(game, history);
        }
      });
    }

    return history;
  });

  return history;
};
