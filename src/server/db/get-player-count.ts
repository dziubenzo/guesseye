'use server';

import { db } from '@/server/db/index';
import { player } from '@/server/db/schema';
import { unstable_cache } from 'next/cache';

export const getPlayerCount = unstable_cache(
  async () => {
    return await db.$count(player);
  },
  ['playerCount'],
  { tags: ['playerCount'] }
);
