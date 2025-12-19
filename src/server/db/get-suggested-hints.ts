'use server';

import type { SuggestedHint } from '@/lib/types';
import { db } from '@/server/db/index';
import { hint, player } from '@/server/db/schema';
import { and, desc, eq, getTableColumns, sql } from 'drizzle-orm';
import { unstable_cache } from 'next/cache';

export const getSuggestedHints = unstable_cache(
  async () => {
    const hintColumns = getTableColumns(hint);

    const suggestedHints: SuggestedHint[] = await db
      .select({
        ...hintColumns,
        // Single quotes for the space is a must, the Drizzle docs have it wrong
        fullName:
          sql<string>`concat(${player.firstName}, ' ', ${player.lastName})`.as(
            'full_name'
          ),
        approvedHintsCount: db.$count(
          hint,
          and(eq(hint.playerId, player.id), eq(hint.isApproved, true))
        ),
      })
      .from(hint)
      .leftJoin(player, eq(hint.playerId, player.id))
      .where(eq(hint.isApproved, false))
      .orderBy(desc(hint.createdAt));

    return suggestedHints;
  },
  ['suggestedHints'],
  { tags: ['suggestedHints'] }
);
