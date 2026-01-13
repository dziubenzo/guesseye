'use server';

import type { UpdateAction } from '@/lib/types';
import { normaliseToString } from '@/lib/utils';
import { db } from '@/server/db';
import { playersNormalisedMap } from '@/server/db/get-players-map';
import { player as playerSchema } from '@/server/db/schema';
import { checkForAdmin, getTourCardHolders } from '@/server/utils';
import { and, eq } from 'drizzle-orm';
import { revalidateTag } from 'next/cache';

export default async function updateTourCardHolders() {
  let result: UpdateAction;

  const isAdmin = await checkForAdmin();

  if (!isAdmin) {
    result = {
      type: 'error',
      message: 'You are not authorised to perform this operation.',
    };
    return result;
  }

  const tourCardHolders = await getTourCardHolders();

  if ('error' in tourCardHolders) {
    result = {
      type: 'error',
      message: tourCardHolders.error,
    };
    return result;
  }

  // Set tour card value to false for all darts players who currently have the tour card value of true
  await db
    .update(playerSchema)
    .set({ tourCard: false })
    .where(eq(playerSchema.tourCard, true));

  let updateCount = 0;
  const missingPlayers: string[] = [];

  for (const tourCardHolder of tourCardHolders) {
    const normalisedFullName =
      normaliseToString(tourCardHolder.firstName) +
      ' ' +
      normaliseToString(tourCardHolder.lastName);

    // Update the tour card value to true if the TC holder is in the players map (DB)
    if (playersNormalisedMap.has(normalisedFullName)) {
      const player = playersNormalisedMap.get(normalisedFullName)!;
      await db
        .update(playerSchema)
        .set({ tourCard: true })
        .where(
          and(
            eq(playerSchema.firstName, player.firstName),
            eq(playerSchema.lastName, player.lastName)
          )
        );
      updateCount++;
    } else {
      // Identify Tour Card Holders who are not in the DB
      const fullName = tourCardHolder.firstName + ' ' + tourCardHolder.lastName;
      missingPlayers.push(fullName);
    }
  }

  // Clear the players and last database update cache
  revalidateTag('players');
  revalidateTag('lastDatabaseUpdate');

  const missingPlayersString =
    missingPlayers.length > 0
      ? `Missing Tour Card Holders: ${missingPlayers.join(', ')}.`
      : '';

  result = {
    type: 'success',
    message: `Tour Card Holders updated successfully [${updateCount}/128].${missingPlayersString}`,
  };

  return result;
}
