'use server';

import type { HintCounts } from '@/lib/types';
import { db } from '@/server/db/index';
import { hint } from '@/server/db/schema';
import { count, countDistinct } from 'drizzle-orm';
import { unstable_cache } from 'next/cache';

export const getHintCount = unstable_cache(
  async () => {
    const [counts] = await db
      .select({
        totalHintCount: count(),
        playerHintCount: countDistinct(hint.playerId),
      })
      .from(hint);
    return counts as HintCounts;
  },
  ['hintCount'],
  { tags: ['hintCount'] }
);
