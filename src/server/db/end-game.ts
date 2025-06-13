'use server';

import type { ErrorObject, Game, OfficialGame, RandomGame } from '@/lib/types';
import { db } from '@/server/db/index';
import { game as gameTable } from '@/server/db/schema';
import { eq } from 'drizzle-orm';

export const endGame = async (
  type: 'win' | 'giveUp',
  game: OfficialGame | RandomGame | Game
) => {
  if (
    (type === 'win' && game.hasGivenUp) ||
    (type === 'giveUp' && game.hasWon)
  ) {
    const error: ErrorObject = { error: 'An unexpected error occurred.' };
    return error;
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
