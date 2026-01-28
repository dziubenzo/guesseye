'use server';

import type { ErrorObject, Game, OfficialGame, RandomGame } from '@/lib/types';
import { db } from '@/server/db/index';
import { game as gameTable } from '@/server/db/schema';
import { eq } from 'drizzle-orm';
import { revalidateTag } from 'next/cache';

export const endGame = async (
  type: 'win' | 'giveUp',
  game: OfficialGame | RandomGame | Game
) => {
  if (game.status !== 'inProgress') {
    const error: ErrorObject = { error: 'An unexpected error occurred.' };
    return error;
  }

  await db
    .update(gameTable)
    .set({
      status: type === 'win' ? 'won' : 'givenUp',
      endDate: new Date(),
    })
    .where(eq(gameTable.id, game.id));

  if (game.userId) {
    revalidateTag(`completedGames:${game.userId}`);
  }

  revalidateTag(`completedGameDetails:${game.id}`);

  return;
};
