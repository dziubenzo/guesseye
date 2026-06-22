'use server';

import type { Game } from '@/lib/types';
import { updateTag } from 'next/cache';

export default async function revalidateCompletedGames(
  gameId?: Game['id'],
  userId?: Game['userId']
) {
  if (gameId) {
    updateTag(`completedGame:${gameId}`);
  }

  if (userId) {
    updateTag(`completedGames:${userId}`);
  }

  return;
}
