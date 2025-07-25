'use server';

import type { UpdateAction, UpdateRankingsType } from '@/lib/types';
import { getUpdateMessage } from '@/lib/utils';
import getUpdatedRankings from '@/server/scripts/get-updated-rankings';
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

  const updatedRankings = await getUpdatedRankings(type);

  if ('error' in updatedRankings) {
    result = {
      type: 'error',
      message: updatedRankings.error,
    };
    return result;
  }

  const { updateCount, playersDB, missingPlayers } = await updateDBRankings(
    type,
    updatedRankings
  );

  // Clear the players and last database update cache
  revalidateTag('players');
  revalidateTag('lastDatabaseUpdate');

  const updateMessage = getUpdateMessage(type);

  // List PDC World Rankings and Elo rankings players that are missing in the DB
  const missingPlayersString =
    (type === 'menPDC' || type === 'elo') && missingPlayers.length > 0
      ? ` Missing players: ${missingPlayers.toString()}.`
      : '';

  result = {
    type: 'success',
    message:
      `${updateMessage} updated successfully. ${updateCount} players out of ${playersDB} players in the DB were updated.` +
      missingPlayersString,
  };

  return result;
}