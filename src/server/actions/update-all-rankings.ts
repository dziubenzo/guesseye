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

  const [PDCMen, PDCWomen, WDFMen, WDFWomen] = await Promise.all([
    updateRankings('PDC', 'men'),
    updateRankings('PDC', 'women'),
    updateRankings('WDF', 'men'),
    updateRankings('WDF', 'women'),
  ]);

  if (
    PDCMen.type === 'error' ||
    PDCWomen.type === 'error' ||
    WDFMen.type === 'error' ||
    WDFWomen.type === 'error'
  ) {
    result = {
      type: 'error',
      message: `At least one of the update operations failed.
      PDC Men: ${PDCMen.message}
      PDC Women: ${PDCWomen.message}
      WDF Men: ${WDFMen.message}
      WDF Women: ${WDFWomen.message}
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
    PDC Men: ${PDCMen.message}
    PDC Women: ${PDCWomen.message}
    WDF Men: ${WDFMen.message}
    WDF Women: ${WDFWomen.message}
    `,
  };

  return result;
}
