'use server';

import { db } from '@/server/db/index';
import { hint } from '@/server/db/schema';
import { eq, sql } from 'drizzle-orm';
import { cacheLife, cacheTag } from 'next/cache';

export const getHintsCountsByPlayer = async () => {
  'use cache';
  cacheLife('max');
  cacheTag('hintCountsStats');

  const hintsCounts = await db
    .select({
      playerId: hint.playerId,
      hintsCount: sql<number>`cast(count(${hint.playerId}) as int)`,
    })
    .from(hint)
    .where(eq(hint.isApproved, true))
    .groupBy(hint.playerId);

  return hintsCounts;
};
