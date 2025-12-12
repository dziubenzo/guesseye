'use server';

import type { PlayerFullName } from '@/lib/types';
import { db } from '@/server/db/index';
import { unstable_cache } from 'next/cache';

export const getPlayerFullNames = unstable_cache(
  async () => {
    const namesDB = await db.query.player.findMany({
      columns: {
        firstName: true,
        lastName: true,
      },
    });

    const names: PlayerFullName[] = [];

    // Aggregation to fullName with sql`` does not work for some reason
    for (const player of namesDB) {
      names.push({
        fullName: player.firstName + ' ' + player.lastName,
      });
    }

    return names;
  },
  ['names'],
  { tags: ['names'] }
);
