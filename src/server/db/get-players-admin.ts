'use server';

import type { PlayerAdmin } from '@/lib/types';
import { db } from '@/server/db/index';
import { hint, player, schedule } from '@/server/db/schema';
import { and, eq } from 'drizzle-orm';
import { unstable_cache } from 'next/cache';

export const getPlayersAdmin = unstable_cache(
  async () => {
    // Query API v1 does not support aggregation
    const playersAdmin: PlayerAdmin[] = await db
      .select({
        id: player.id,
        firstName: player.firstName,
        lastName: player.lastName,
        gender: player.gender,
        difficulty: player.difficulty,
        officialModeCount: db.$count(
          schedule,
          eq(schedule.playerToFindId, player.id)
        ),
        hints: db.$count(
          hint,
          and(eq(hint.playerId, player.id), eq(hint.isApproved, true))
        ),
      })
      .from(player)
      .orderBy(player.difficulty, player.firstName);

    return playersAdmin;
  },
  ['playersAdmin'],
  { tags: ['playersAdmin'] }
);
