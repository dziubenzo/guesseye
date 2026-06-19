import type { HintCounts } from '@/lib/types';
import { db } from '@/server/db/index';
import { hint } from '@/server/db/schema';
import { count, countDistinct, eq } from 'drizzle-orm';
import { cacheLife, cacheTag } from 'next/cache';

export const getHintCounts = async () => {
  'use cache';
  cacheLife('max');
  cacheTag('hintCountsSuggestHint');

  const [counts]: HintCounts[] = await db
    .select({
      totalHintCount: count(),
      playerHintCount: countDistinct(hint.playerId),
    })
    .from(hint)
    .where(eq(hint.isApproved, true));

  return counts;
};
