'use server';

import type { PlayerSuggestHint } from '@/lib/types';
import { db } from '@/server/db/index';
import { player } from '@/server/db/schema';
import { sql } from 'drizzle-orm';
import { unstable_cache } from 'next/cache';

export const getPlayersSuggestHint = unstable_cache(
  async () => {
    const players: PlayerSuggestHint[] = await db.query.player.findMany({
      columns: {
        id: true,
        firstName: true,
        lastName: true,
      },
      extras: {
        difficulty: sql<null>`NULL`.as('difficulty'),
      },
      orderBy: player.firstName,
    });

    return players;
  },
  ['playersSuggestHint'],
  { tags: ['playersSuggestHint'] }
);
