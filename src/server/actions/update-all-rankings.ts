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
      message: `At least one ranking update failed.
      1: PDC Men - ${menPDC.message}
      2: PDC Women - ${womenPDC.message}
      3: WDF Men - ${menWDF.message}
      4: WDF Women - ${womenWDF.message}
      5: Elo - ${elo.message}
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
    1: PDC Men - ${menPDC.message}
    2: PDC Women - ${womenPDC.message}
    3: WDF Men - ${menWDF.message}
    4: WDF Women - ${womenWDF.message}
    5: Elo - ${elo.message}
    Relevant cache revalidated successfully
    `,
  };

  return result;
}
