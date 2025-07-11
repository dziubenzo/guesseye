'use server';

import type { UpdateAction } from '@/lib/types';
import { normaliseString } from '@/lib/utils';
import { db } from '@/server/db';
import { player as playerSchema } from '@/server/db/schema';
import { getPDCOoM } from '@/server/utils';
import { and, eq, isNotNull } from 'drizzle-orm';
import { revalidateTag } from 'next/cache';

const URL = 'https://www.dartsrankings.com/womens-series';
const rankingsSelector = 'tr td:first-child';
const fullNamesSelector = 'tr td:nth-child(2)';

export default async function updateWomensSeriesOoM() {
  const updatedRankings = await getPDCOoM(
    URL,
    rankingsSelector,
    fullNamesSelector
  );

  let result: UpdateAction;

  if ('error' in updatedRankings) {
    result = {
      type: 'error',
      message: updatedRankings.error,
    };
    return result;
  }

  // Get female darts players
  const players = await db.query.player.findMany({
    where: eq(playerSchema.gender, 'female'),
    columns: { firstName: true, lastName: true, rankingPDC: true },
  });

  // Set PDC ranking value to null for all female darts players
  await db
    .update(playerSchema)
    .set({ rankingPDC: null })
    .where(
      and(isNotNull(playerSchema.rankingPDC), eq(playerSchema.gender, 'female'))
    );

  let updateCount = 0;

  // Update PDC ranking of a darts player if their first name and last name match the scraped data
  for (const player of players) {
    for (const updatedRanking of updatedRankings) {
      const playerFirstName = normaliseString(player.firstName);
      const playerLastName = normaliseString(player.lastName);
      const updatedPlayerFirstName = normaliseString(updatedRanking.firstName);
      const updatedPlayerLastName = normaliseString(updatedRanking.lastName);

      if (
        playerFirstName !== updatedPlayerFirstName ||
        playerLastName !== updatedPlayerLastName
      ) {
        continue;
      }

      await db
        .update(playerSchema)
        .set({ rankingPDC: updatedRanking.ranking })
        .where(
          and(
            eq(playerSchema.firstName, player.firstName),
            eq(playerSchema.lastName, player.lastName)
          )
        );
      updateCount++;
      break;
    }
  }

  // Clear the players cache
  revalidateTag('players');

  result = {
    type: 'success',
    message: `PDC Women's Series Order of Merit rankings updated successfully. ${updateCount} players out of ${players.length} female players in the DB were updated. There are ${updatedRankings.length} players in the PDC Women's Series Order of Merit.`,
  };

  return result;
}
