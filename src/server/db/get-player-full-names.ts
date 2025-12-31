'use server';

import type { PlayerFullName } from '@/lib/types';
import { db } from '@/server/db/index';
import { player } from '@/server/db/schema';
import { sql } from 'drizzle-orm';
import { unstable_cache } from 'next/cache';

export const getPlayerFullNames = unstable_cache(
  async () => {
    const names: PlayerFullName[] = await db
      .select({
        fullName:
          sql<string>`concat(${player.firstName}, ' ', ${player.lastName})`.as(
            'full_name'
          ),
      })
      .from(player);

    return names;
  },
  ['fullNames'],
  { tags: ['fullNames'] }
);
