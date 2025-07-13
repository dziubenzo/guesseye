'use server';

import type { UpdateAction } from '@/lib/types';
import getUpdatedRankings from '@/server/scripts/get-updated-rankings';
import { updateDBRankings } from '@/server/utils';
import { revalidateTag } from 'next/cache';

export default async function updateRankings(
  organisation: 'PDC' | 'WDF',
  type: 'men' | 'women'
) {
  const updatedRankings = await getUpdatedRankings(organisation, type);

  let result: UpdateAction;

  if ('error' in updatedRankings) {
    result = {
      type: 'error',
      message: updatedRankings.error,
    };
    return result;
  }

  const { updateCount, playersDB } = await updateDBRankings(
    organisation,
    type,
    updatedRankings
  );

  // Clear the players and last database update cache
  revalidateTag('players');
  revalidateTag('lastDatabaseUpdate');

  const gender = type === 'men' ? 'male' : 'female';

  result = {
    type: 'success',
    message: `${organisation} rankings for ${type} updated successfully. ${updateCount} ${gender} players out of ${playersDB} ${gender} players in the DB were updated.`,
  };

  return result;
}
