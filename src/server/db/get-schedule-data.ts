'use server';

import type {
  ErrorObject,
  Schedule,
  ScheduleWithPlayerAndGame,
} from '@/lib/types';
import { db } from '@/server/db/index';
import { game, guess, hint, schedule } from '@/server/db/schema';
import { getUserOrGuest } from '@/server/utils';
import { and, asc, desc, eq, gte, lt } from 'drizzle-orm';

export const getScheduleData = async (scheduleId?: Schedule['id']) => {
  const { session } = await getUserOrGuest();

  if (!session) {
    const error: ErrorObject = { error: 'You are not logged in.' };
    return error;
  }

  const scheduleData: ScheduleWithPlayerAndGame | undefined =
    await db.query.schedule.findFirst({
      where: scheduleId
        ? eq(schedule.id, scheduleId)
        : and(
            lt(schedule.startDate, new Date()),
            gte(schedule.endDate, new Date())
          ),
      with: {
        // Should return a single game or no game
        games: {
          where: eq(game.userId, session.user.id),
          with: {
            guesses: {
              with: { player: true },
              orderBy: desc(guess.createdAt),
            },
          },
        },
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

  // Make sure any scheduled darts players for the future cannot be returned
  if (!scheduleData || scheduleData.startDate > new Date()) {
    const error: ErrorObject = {
      error: scheduleId ? 'Invalid game.' : 'No scheduled darts player.',
    };
    return error;
  }

  if (scheduleData.games.length > 1) {
    const error: ErrorObject = {
      error: 'More than one official game found.',
    };
    return error;
  }

  return scheduleData;
};
