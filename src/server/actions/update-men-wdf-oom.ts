'use server';

import type { UpdateAction } from '@/lib/types';
import { normaliseString } from '@/lib/utils';
import { db } from '@/server/db';
import { player as playerSchema } from '@/server/db/schema';
import { getWDFOoM } from '@/server/utils';
import { and, eq, isNotNull } from 'drizzle-orm';
import { revalidateTag } from 'next/cache';

const URL = 'https://dartswdf.com/rankings/wdf-main-ranking-men';
const rankingsSelector = 'div.text-sm a.inline-flex span:first-child';
const fullNamesSelector = 'div.text-sm a.inline-flex span.truncate';

export default async function updateMenWDFOoM() {
  const updatedRankings = await getWDFOoM(
    URL,
    rankingsSelector,
    fullNamesSelector,
    500
  );

  let result: UpdateAction;

  if ('error' in updatedRankings) {
    result = {
      type: 'error',
      message: updatedRankings.error,
    };
    return result;
  }

  // Get male darts players
  const players = await db.query.player.findMany({
    where: eq(playerSchema.gender, 'male'),
    columns: { firstName: true, lastName: true, rankingWDF: true },
  });

  // Set WDF ranking value to null for all male darts players
  await db
    .update(playerSchema)
    .set({ rankingWDF: null })
    .where(
      and(isNotNull(playerSchema.rankingWDF), eq(playerSchema.gender, 'male'))
    );

  let updateCount = 0;

  // Update WDF ranking of a darts player if their first name and last name match the scraped data
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
        .set({ rankingWDF: updatedRanking.ranking })
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
    message: `WDF Order of Merit rankings updated successfully. ${updateCount} players out of ${players.length} male players in the DB were updated.`,
  };

  return result;
}
