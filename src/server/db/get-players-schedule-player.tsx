'use server';

import type { PlayerGroupedByDifficulty } from '@/lib/types';
import { db } from '@/server/db/index';
import { hint, player, schedule } from '@/server/db/schema';
import { and, eq, sql } from 'drizzle-orm';
import { cacheLife, cacheTag } from 'next/cache';

export const getPlayersSchedulePlayer = async () => {
  'use cache';
  cacheLife('max');
  cacheTag('playersSchedulePlayer');

  // Query API v1 does not support aggregation
  const players = await db
    .select({
      id: player.id,
      fullName:
        sql<string>`concat(${player.firstName}, ' ', ${player.lastName})`.as(
          'full_name'
        ),
      difficulty: player.difficulty,
      officialModeCount: db.$count(
        schedule,
        eq(schedule.playerToFindId, player.id)
      ),
      approvedHintsCount: db.$count(
        hint,
        and(eq(hint.playerId, player.id), eq(hint.isApproved, true))
      ),
    })
    .from(player)
    .orderBy(player.difficulty, player.firstName);

  const groupedByDifficulty = Object.groupBy(
    players,
    ({ difficulty }) => difficulty
  );

  const playersByDifficulty: PlayerGroupedByDifficulty[] = [];

  let key: keyof typeof groupedByDifficulty;

  for (key in groupedByDifficulty) {
    playersByDifficulty.push({
      value: key,
      items: groupedByDifficulty[key]!,
    });
  }

  return playersByDifficulty;
};
