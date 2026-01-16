'use server';

import type { ErrorObject, NextScheduledPlayer, Schedule } from '@/lib/types';
import { db } from '@/server/db/index';
import { schedule } from '@/server/db/schema';
import { eq } from 'drizzle-orm';

export const getNextScheduledPlayer = async (
  currentPlayerEndDate: Schedule['endDate']
) => {
  const nextScheduledPlayer: NextScheduledPlayer | undefined =
    await db.query.schedule.findFirst({
      columns: { startDate: true },
      where: eq(schedule.startDate, currentPlayerEndDate),
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

  return nextScheduledPlayer;
};
