'use server';

import { db } from '@/server/db/index';
import { unstable_cache } from 'next/cache';

export const getPlayers = unstable_cache(
  async () => {
    return await db.query.player.findMany();
  },
  ['players'],
  { tags: ['players'] }
);
