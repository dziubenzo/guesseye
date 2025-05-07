'use server';

import { db } from '@/server/db/index';
import { and, gte, lt, sql } from 'drizzle-orm';
import { schedule } from './schema';
import { revalidateTag } from 'next/cache';

export const getScheduledPlayer = async () => {
  const scheduledPlayer = await db.query.schedule.findFirst({
    where: and(
      lt(schedule.startDate, new Date()),
      gte(schedule.endDate, new Date())
    ),
    with: { playerToFind: true },
  });

  // Schedule a random player should no darts player be scheduled
  if (!scheduledPlayer) {
    const newlyScheduledPlayer = await scheduleRandomPlayer();

    return newlyScheduledPlayer;
  }

  return scheduledPlayer;
};

const scheduleRandomPlayer = async () => {
  const randomPlayer = await db.query.player.findFirst({
    orderBy: sql`RANDOM()`,
  });

  if (!randomPlayer) {
    return undefined;
  }

  await db.insert(schedule).values({
    playerToFindId: randomPlayer.id,
    startDate: new Date(),
  });

  // Revalidate cached getPlayers() query
  revalidateTag('players');

  const newlyScheduledPlayer = await db.query.schedule.findFirst({
    where: and(
      lt(schedule.startDate, new Date()),
      gte(schedule.endDate, new Date())
    ),
    with: { playerToFind: true },
  });

  return newlyScheduledPlayer;
};
