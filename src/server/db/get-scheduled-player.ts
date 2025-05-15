'use server';

import type { ScheduleWithPlayer } from '@/lib/types';
import { db } from '@/server/db/index';
import { schedule } from '@/server/db/schema';
import { and, gte, lt } from 'drizzle-orm';

export const getScheduledPlayer = async () => {
  const scheduledPlayer = await db.query.schedule.findFirst({
    where: and(
      lt(schedule.startDate, new Date()),
      gte(schedule.endDate, new Date())
    ),
    with: { playerToFind: true },
  });

  if (!scheduledPlayer) {
    return undefined;
  }

  return scheduledPlayer as ScheduleWithPlayer;
};
