'use server';

import type {
  ErrorObject,
  Schedule,
  ScheduleWithPlayerAndGame,
} from '@/lib/types';
import { db } from '@/server/db/index';
import { hint, schedule } from '@/server/db/schema';
import { and, asc, eq, gte, lt } from 'drizzle-orm';

export const getScheduledPlayer = async (scheduleId?: Schedule['id']) => {
  const scheduledPlayer = await db.query.schedule.findFirst({
    where: scheduleId
      ? eq(schedule.id, scheduleId)
      : and(
          lt(schedule.startDate, new Date()),
          gte(schedule.endDate, new Date())
        ),
    with: {
      playerToFind: {
        with: {
          hints: {
            columns: {
              createdAt: true,
              hint: true,
            },
            with: {
              user: {
                columns: { name: true },
              },
            },
            where: eq(hint.isApproved, true),
            orderBy: asc(hint.createdAt),
          },
        },
      },
    },
  });

  if (!scheduledPlayer) {
    const error: ErrorObject = {
      error: scheduleId ? 'Invalid game.' : 'No scheduled darts player.',
    };
    return error;
  }

  // Make sure any scheduled darts players for the future cannot be returned
  if (scheduledPlayer.startDate > new Date()) {
    const error: ErrorObject = { error: 'Invalid game.' };
    return error;
  }

  return scheduledPlayer as ScheduleWithPlayerAndGame;
};
