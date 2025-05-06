'use server';

import { db } from '@/server/db/index';
import { and, gte, lt } from 'drizzle-orm';
import { schedule } from './schema';

export const getScheduledPlayerDifficulty = async () => {
  const scheduledPlayer = await db.query.schedule.findFirst({
    columns: {
      id: false,
      startDate: false,
      endDate: false,
      playerToFindId: false,
    },
    where: and(
      lt(schedule.startDate, new Date()),
      gte(schedule.endDate, new Date())
    ),
    with: {
      playerToFind: {
        columns: {
          difficulty: true,
        },
      },
    },
  });

  if (!scheduledPlayer) {
    return null;
  }

  return scheduledPlayer.playerToFind.difficulty;
};
