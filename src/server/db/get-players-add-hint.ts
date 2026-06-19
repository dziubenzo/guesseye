'use server';

import type { PlayerGroupedByHintsAdmin } from '@/lib/types';
import { db } from '@/server/db/index';
import { hint, player } from '@/server/db/schema';
import { and, eq, sql } from 'drizzle-orm';
import { cacheLife, cacheTag } from 'next/cache';

export const getPlayersAddHint = async () => {
  'use cache';
  cacheLife('max');
  cacheTag('playersAddHint');

  const approvedHintsCountQuery = db.$count(
    hint,
    and(eq(hint.playerId, player.id), eq(hint.isApproved, true))
  );

  // Query API v1 does not support aggregation
  const players = await db
    .select({
      id: player.id,
      fullName:
        sql<string>`concat(${player.firstName}, ' ', ${player.lastName})`.as(
          'full_name'
        ),
      difficulty: player.difficulty,
      approvedHintsCount: approvedHintsCountQuery,
    })
    .from(player)
    .orderBy(approvedHintsCountQuery, player.firstName);

  const groupedByHints = Object.groupBy(players, ({ approvedHintsCount }) =>
    approvedHintsCount === 1 ? '1 hint' : `${approvedHintsCount} hints`
  );

  const playersByHints: PlayerGroupedByHintsAdmin[] = [];

  let key: keyof typeof groupedByHints;

  for (key in groupedByHints) {
    playersByHints.push({
      value: key,
      items: groupedByHints[key]!.map((player) => ({
        id: player.id,
        fullName: player.fullName,
        difficulty: player.difficulty,
      })),
    });
  }

  return playersByHints;
};
