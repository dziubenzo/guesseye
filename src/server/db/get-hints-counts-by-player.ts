'use server';

import { db } from '@/server/db/index';
import { hint } from '@/server/db/schema';
import { eq, sql } from 'drizzle-orm';
import { unstable_cache } from 'next/cache';

export const getHintsCountsByPlayer = unstable_cache(
  async () => {
    return await db
      .select({
        playerId: hint.playerId,
        hintsCount: sql<number>`cast(count(${hint.playerId}) as int)`,
      })
      .from(hint)
      .where(eq(hint.isApproved, true))
      .groupBy(hint.playerId);
  },
  ['hintsCounts'],
  { tags: ['hintsCounts'] }
);
