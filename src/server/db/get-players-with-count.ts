'use server';

import type { PlayerWithCount } from '@/lib/types';
import { db } from '@/server/db/index';
import { player, schedule } from '@/server/db/schema';
import { eq } from 'drizzle-orm';

export const getPlayersWithCount = async () => {
  // Query API v1 does not support aggregation
  const playersWithCount: PlayerWithCount[] = await db
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
    })
    .from(player)
    .orderBy(player.difficulty, player.firstName);

  return playersWithCount;
};
