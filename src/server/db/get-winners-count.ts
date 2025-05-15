'use server';

import type { ScheduleWithPlayer } from '@/lib/types';
import { db } from '@/server/db/index';
import { game } from '@/server/db/schema';
import { and, eq } from 'drizzle-orm';

export const getWinnersCount = async (scheduledPlayer: ScheduleWithPlayer) => {
  const winnersCount = await db.$count(
    game,
    and(eq(game.scheduledPlayerId, scheduledPlayer.id), eq(game.hasWon, true))
  );

  return winnersCount;
};
