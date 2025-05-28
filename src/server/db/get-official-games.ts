'use server';

import { auth } from '@/lib/auth';
import type { ErrorObject, GameInfo, OfficialGames } from '@/lib/types';
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

  // Get all previous scheduled players up to the current one
  // Get all official games played by the user
  const [scheduleRows, officialGames] = await Promise.all([
    db.query.schedule.findMany({
      where: lt(schedule.startDate, new Date()),
      with: { playerToFind: true },
      orderBy: desc(schedule.startDate),
    }),
    db.query.game.findMany({
      where: and(
        eq(game.userId, session?.user.id),
        eq(game.gameMode, 'official')
      ),
      with: { scheduledPlayer: true, guesses: true },
      orderBy: desc(schedule.id),
    }),
  ]);

  // Return scheduled players enriched with game-specific information if there is a game associated with a scheduled player
  const data = scheduleRows.map((scheduledPlayer) => {
    const result: OfficialGames = {
      scheduleId: scheduledPlayer.id,
      startDate: scheduledPlayer.startDate,
      endDate: scheduledPlayer.endDate,
      playerDifficulty: scheduledPlayer.playerToFind.difficulty,
      gameExists: false,
    };

    for (const game of officialGames) {
      if (game.scheduledPlayerId === scheduledPlayer.id) {
        result.gameExists = true;

        let fullName: string | undefined =
          scheduledPlayer.playerToFind.firstName +
          ' ' +
          scheduledPlayer.playerToFind.lastName;
        let gameStatus: GameInfo['gameStatus'];

        if (game.hasWon) {
          gameStatus = 'won';
        } else if (game.hasGivenUp) {
          gameStatus = 'givenUp';
        } else {
          fullName = undefined;
          gameStatus = 'inProgress';
        }

        result.gameInfo = {
          fullName,
          gameStatus,
        };
        break;
      }
    }

    return result;
  });

  return data;
};
