'use server';

import type { UpdateAction } from '@/lib/types';
import updateRankings from '@/server/actions/update-rankings';
import { checkForAdmin } from '@/server/utils';
import { revalidateTag } from 'next/cache';

export default async function updateAllRankings() {
  let result: UpdateAction;

  const isAdmin = await checkForAdmin();

  if (!isAdmin) {
    result = {
      type: 'error',
      message: 'Unauthorised operation.',
    };
    return result;
  }

  const [menPDC, womenPDC, menWDF, womenWDF, elo] = await Promise.all([
    updateRankings('menPDC'),
    updateRankings('womenPDC'),
    updateRankings('menWDF'),
    updateRankings('womenWDF'),
    updateRankings('elo'),
  ]);

  if (
    menPDC.type === 'error' ||
    womenPDC.type === 'error' ||
    menWDF.type === 'error' ||
    womenWDF.type === 'error' ||
    elo.type === 'error'
  ) {
    result = {
      type: 'error',
      message: `At least one of the update operations failed.
      PDC Men: ${menPDC.message}
      PDC Women: ${womenPDC.message}
      WDF Men: ${menWDF.message}
      WDF Women: ${womenWDF.message}
      Elo: ${elo.message}
    `,
    };
    return result;
  }

  // Clear the players and last database update cache
  revalidateTag('players');
  revalidateTag('lastDatabaseUpdate');

  result = {
    type: 'success',
    message: `All rankings updated successfully.
    PDC Men: ${menPDC.message}
    PDC Women: ${womenPDC.message}
    WDF Men: ${menWDF.message}
    WDF Women: ${womenWDF.message}
    Elo: ${elo.message}
    `,
  };

  return result;
}
