'use server';

import { db } from '@/server/db/index';
import { player } from '@/server/db/schema';
import { desc } from 'drizzle-orm';
import { unstable_cache } from 'next/cache';

export const getLastDBUpdate = unstable_cache(
  async () => {
    const lastUpdatedPlayer = await db.query.player.findFirst({
      columns: {
        updatedAt: true,
      },
      orderBy: [desc(player.updatedAt)],
    });

    return lastUpdatedPlayer?.updatedAt;
  },
  ['lastDBUpdate'],
  { tags: ['lastDBUpdate'] }
);
