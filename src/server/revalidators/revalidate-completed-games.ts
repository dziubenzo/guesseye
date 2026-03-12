'use server';

import type { Game } from '@/lib/types';
import { revalidateTag } from 'next/cache';

export default async function revalidateCompletedGames(
  gameId?: Game['id'],
  userId?: Game['userId']
) {
  if (!gameId) {
    return;
  } else {
    if (userId) {
      revalidateTag(`completedGames:${userId}`);
    }

    revalidateTag(`completedGameDetails:${gameId}`);
  }

  return;
}
