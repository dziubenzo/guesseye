'use server';

import type { Game, Player } from '@/lib/types';
import { db } from '@/server/db/index';
import { guess } from '@/server/db/schema';
import { and, eq } from 'drizzle-orm';

export const createGuess = async (
  gameId: Game['id'],
  playerId: Player['id']
) => {
  const guessAlreadyExists = await db.query.guess.findFirst({
    where: and(eq(guess.gameId, gameId), eq(guess.playerId, playerId)),
  });

  if (guessAlreadyExists) {
    return { error: 'You have already guessed this player.' };
  }

  await db.insert(guess).values({
    gameId,
    playerId,
  });

  return;
};
