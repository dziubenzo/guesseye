import type { PlayerGroupedByHints } from '@/lib/types';
import { db } from '@/server/db/index';
import { hint, player } from '@/server/db/schema';
import { and, eq, sql } from 'drizzle-orm';
import { cacheLife, cacheTag } from 'next/cache';

export const getPlayersSuggestHint = async () => {
  'use cache';
  cacheLife('max');
  cacheTag('playersSuggestHint');

  // Query API v1 does not support aggregation
  const players = await db
    .select({
      id: player.id,
      fullName:
        sql<string>`concat(${player.firstName}, ' ', ${player.lastName})`.as(
          'full_name'
        ),
      approvedHintsCount: db.$count(
        hint,
        and(eq(hint.playerId, player.id), eq(hint.isApproved, true))
      ),
    })
    .from(player)
    .orderBy(player.firstName);

  const groupedByHints = Object.groupBy(players, ({ approvedHintsCount }) =>
    approvedHintsCount === 1 ? '1 hint' : `${approvedHintsCount} hints`
  );

  const playersByHints: PlayerGroupedByHints[] = [];

  for (const hintsGroup in groupedByHints) {
    playersByHints.push({
      value: hintsGroup as keyof typeof groupedByHints,
      items: groupedByHints[hintsGroup as keyof typeof groupedByHints]!.map(
        (player) => ({
          id: player.id,
          fullName: player.fullName,
        })
      ),
    });
  }

  return playersByHints;
};
