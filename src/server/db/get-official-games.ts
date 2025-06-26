'use server';

import { auth } from '@/lib/auth';
import type { ErrorObject, OfficialGames } from '@/lib/types';
import { db } from '@/server/db/index';
import { game, schedule } from '@/server/db/schema';
import { and, desc, eq, lt } from 'drizzle-orm';
import { headers } from 'next/headers';

export const getOfficialGames = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    const error: ErrorObject = { error: 'Please log in first.' };
    return error;
  }

  // Get all previous scheduled players up to the current one together with all official games played by the user
  const scheduleRows = await db.query.schedule.findMany({
    where: lt(schedule.startDate, new Date()),
    with: {
      playerToFind: true,
      games: {
        where: and(eq(game.userId, session.user.id), eq(game.mode, 'official')),
      },
    },
    orderBy: desc(schedule.startDate),
  });

  // Return scheduled players enriched with game-specific information if there is a game associated with a scheduled player
  const data = scheduleRows.map((scheduledPlayer, index) => {
    const result: OfficialGames = {
      gameNo: scheduleRows.length - index,
      scheduleId: scheduledPlayer.id,
      startDate: scheduledPlayer.startDate,
      endDate: scheduledPlayer.endDate,
      playerDifficulty: scheduledPlayer.playerToFind.difficulty,
      gameInfo: {
        fullName: undefined,
        status: 'notPlayed',
      },
    };

    if (scheduledPlayer.games.length === 1) {
      const game = scheduledPlayer.games[0];

      let fullName: string | undefined =
        scheduledPlayer.playerToFind.firstName +
        ' ' +
        scheduledPlayer.playerToFind.lastName;

      if (game.status === 'inProgress') {
        fullName = undefined;
      }

      result.gameInfo = {
        fullName,
        status: game.status,
      };
    }

    return result;
  });

  return data;
};
