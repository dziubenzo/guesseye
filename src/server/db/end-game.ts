'use server';

import type { Game } from '@/lib/types';
import { db } from '@/server/db/index';
import { game as gameTable } from '@/server/db/schema';
import { eq } from 'drizzle-orm';

export const endGame = async (type: 'win' | 'giveUp', game: Game) => {
  if (
    (type === 'win' && game.hasGivenUp) ||
    (type === 'giveUp' && game.hasWon)
  ) {
    return { error: 'An unexpected error occurred.' };
  }

  await db
    .update(gameTable)
    .set({
      hasWon: type === 'win' ? true : false,
      hasGivenUp: type === 'giveUp' ? true : false,
      endDate: new Date(),
    })
    .where(eq(gameTable.id, game.id));

  return;
};
