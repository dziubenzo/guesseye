'use server';

import { db } from '@/server/db/index';
import { player } from '@/server/db/schema';
import { cacheLife, cacheTag } from 'next/cache';

export const getPlayerCount = async () => {
  'use cache';
  cacheLife('max');
  cacheTag('playerCount');

  const playerCount = await db.$count(player);

  return playerCount;
};
