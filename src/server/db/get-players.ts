'use server';

import type { Player, PlayerMap } from '@/lib/types';
import { normaliseToString } from '@/lib/utils';
import { db } from '@/server/db/index';
import { cacheLife, cacheTag } from 'next/cache';

export const getPlayers = async () => {
  'use cache';
  cacheLife('max');
  cacheTag('players');

  const players = await db.query.player.findMany();

  const playerMap: PlayerMap = new Map<string, Player>();

  for (const player of players) {
    playerMap.set(player.firstName + ' ' + player.lastName, player);
    playerMap.set(
      normaliseToString(player.firstName) +
        ' ' +
        normaliseToString(player.lastName),
      player
    );
  }

  return { players, playerMap };
};
