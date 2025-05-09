'use server';

import type { ErrorObject, NextScheduledPlayer, Schedule } from '@/lib/types';
import { db } from '@/server/db/index';
import { schedule } from '@/server/db/schema';
import { gte } from 'drizzle-orm';

export const getNextScheduledPlayer = async (
  currentPlayerEndDate: Schedule['endDate']
) => {
  const nextScheduledPlayer = await db.query.schedule.findFirst({
    columns: { startDate: true },
    where: gte(schedule.startDate, currentPlayerEndDate),
    with: {
      playerToFind: {
        columns: { difficulty: true },
      },
    },
  });

  if (!nextScheduledPlayer) {
    const error: ErrorObject = { error: 'No next darts player scheduled.' };
    return error;
  }

  return nextScheduledPlayer as NextScheduledPlayer;
};
