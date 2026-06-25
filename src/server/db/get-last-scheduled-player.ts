'use server';

import type { ErrorObject, LastScheduledPlayer } from '@/lib/types';
import { db } from '@/server/db/index';
import { schedule } from '@/server/db/schema';
import { desc } from 'drizzle-orm';
import { cacheLife, cacheTag } from 'next/cache';

export const getLastScheduledPlayer = async () => {
  'use cache';
  cacheLife('max');
  cacheTag('lastScheduledPlayer');

  const lastScheduledPlayer: LastScheduledPlayer | undefined =
    await db.query.schedule.findFirst({
      columns: { startDate: true, endDate: true },
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

  return lastScheduledPlayer;
};
