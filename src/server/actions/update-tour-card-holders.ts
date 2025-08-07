'use server';

import type { UpdateAction } from '@/lib/types';
import { normaliseToString } from '@/lib/utils';
import { db } from '@/server/db';
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

  // Get all darts players
  const players = await db.query.player.findMany({
    columns: {
      firstName: true,
      lastName: true,
    },
  });

  // Set tour card value to false for all darts players who currently have the tour card value of true
  await db
    .update(playerSchema)
    .set({ tourCard: false })
    .where(eq(playerSchema.tourCard, true));

  let updateCount = 0;
  const missingPlayers: string[] = [];

  // Update the tour card value to true player's first name and last name match the scraped data
  for (const tourCardHolder of tourCardHolders) {
    let playerFound = false;

    for (const player of players) {
      const playerFirstName = normaliseToString(player.firstName);
      const playerLastName = normaliseToString(player.lastName);
      const tourCardHolderFirstName = normaliseToString(
        tourCardHolder.firstName
      );
      const tourCardHolderLastName = normaliseToString(tourCardHolder.lastName);

      if (
        playerFirstName !== tourCardHolderFirstName ||
        playerLastName !== tourCardHolderLastName
      ) {
        continue;
      }

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
      playerFound = true;
      break;
    }

    // Identify Tour Card Holders who are not in the DB
    if (!playerFound) {
      missingPlayers.push(
        tourCardHolder.firstName + ' ' + tourCardHolder.lastName
      );
    }
  }

  // Clear the players and last database update cache
  revalidateTag('players');
  revalidateTag('lastDatabaseUpdate');

  result = {
    type: 'success',
    message: `${updateCount} players updated successfully. ${missingPlayers.length === 0 ? 'No missing Tour Card Holders.' : `Missing Tour Card Holders: ${missingPlayers.toString()}.`}`,
  };

  return result;
}
