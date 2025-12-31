'use server';

import type { ScheduleWithPlayerAndGame } from '@/lib/types';
import { db } from '@/server/db/index';
import { game } from '@/server/db/schema';
import { and, eq } from 'drizzle-orm';

export const getWinnersCount = async (
  scheduledPlayer: ScheduleWithPlayerAndGame
) => {
  const winnersCount = await db.$count(
    game,
    and(eq(game.scheduleId, scheduledPlayer.id), eq(game.status, 'won'))
  );

  return winnersCount;
};
