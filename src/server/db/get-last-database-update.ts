'use server';

import { db } from '@/server/db/index';
import { player } from '@/server/db/schema';
import { desc } from 'drizzle-orm';
import { cacheLife, cacheTag } from 'next/cache';

export const getLastDatabaseUpdate = async () => {
  'use cache';
  cacheLife('max');
  cacheTag('lastDatabaseUpdate');

  const lastUpdatedPlayer = await db.query.player.findFirst({
    columns: {
      updatedAt: true,
    },
    orderBy: [desc(player.updatedAt)],
  });

  return lastUpdatedPlayer?.updatedAt;
};
