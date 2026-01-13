'use server';

import type { UpdateAction, UpdateRankingsType } from '@/lib/types';
import { getUpdateMessage } from '@/lib/utils';
import getRankedPlayers from '@/server/scripts/get-updated-rankings';
import { checkForAdmin, updateDBRankings } from '@/server/utils';
import { revalidateTag } from 'next/cache';

export default async function updateRankings(type: UpdateRankingsType) {
  let result: UpdateAction;

  const isAdmin = await checkForAdmin();

  if (!isAdmin) {
    result = {
      type: 'error',
      message: 'You are not authorised to perform this operation.',
    };
    return result;
  }

  const rankedPlayers = await getRankedPlayers(type);

  if ('error' in rankedPlayers) {
    result = {
      type: 'error',
      message: rankedPlayers.error,
    };
    return result;
  }

  const { updateCount, playersDB, missingPlayers } = await updateDBRankings(
    type,
    rankedPlayers
  );

  // Clear the players and last database update cache
  revalidateTag('players');
  revalidateTag('lastDatabaseUpdate');

  const updateMessage = getUpdateMessage(type);

  const missingPlayersString =
    missingPlayers.length > 0
      ? `Missing players: ${missingPlayers.join(', ')}.`
      : '';

  result = {
    type: 'success',
    message: `${updateMessage} updated successfully [${updateCount}/${playersDB}].${missingPlayersString}`,
  };

  return result;
}
