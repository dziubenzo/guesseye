'use server';

import type { ErrorObject, Schedule } from '@/lib/types';
import { db } from '@/server/db/index';
import { schedule } from '@/server/db/schema';
import { desc } from 'drizzle-orm';

export const getLastScheduledPlayer = async () => {
  const lastScheduledPlayer = await db.query.schedule.findFirst({
    orderBy: desc(schedule.startDate),
  });

  let error: ErrorObject;

  if (!lastScheduledPlayer) {
    error = { error: 'No scheduled players.' };
    return error;
  }

  if (lastScheduledPlayer.endDate.getTime() < Date.now()) {
    error = { error: 'Last scheduled player has already been played.' };
    return error;
  }

  return lastScheduledPlayer as Schedule;
};
