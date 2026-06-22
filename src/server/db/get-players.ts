'use server';

import { db } from '@/server/db/index';
import { cacheLife, cacheTag } from 'next/cache';

export const getPlayers = async () => {
  'use cache';
  cacheLife('max');
  cacheTag('players');

  const players = await db.query.player.findMany();

  return players;
};
