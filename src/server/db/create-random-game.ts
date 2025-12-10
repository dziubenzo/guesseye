'use server';

import type { ErrorObject, Game, RandomGame } from '@/lib/types';
import { getRandomPlayer } from '@/server/db/get-random-player';
import { db } from '@/server/db/index';
import { game } from '@/server/db/schema';
import { getUserOrGuest } from '@/server/utils';
import { eq } from 'drizzle-orm';

export const createRandomGame = async () => {
  const { session, clientIP, clientUserAgent } = await getUserOrGuest();

  const randomPlayer = await getRandomPlayer(
    session
      ? { allowVeryHard: session.user.allowVeryHard }
      : { easierForGuests: true }
  );

  if (!randomPlayer) {
    const error: ErrorObject = { error: 'No random player found.' };
    return error;
  }

  const newGame: Game[] = await db
    .insert(game)
    .values({
      userId: session ? session.user.id : null,
      guestIp: !session ? clientIP : null,
      guestUserAgent: !session ? clientUserAgent : null,
      randomPlayerId: randomPlayer.id,
      startDate: new Date(),
      mode: 'random',
    })
    .returning();

  const newGameWithRandomPlayer: RandomGame | undefined =
    await db.query.game.findFirst({
      where: eq(game.id, newGame[0].id),
      with: {
        randomPlayer: true,
        guesses: {
          with: {
            player: true,
          },
        },
      },
    });

  if (!newGameWithRandomPlayer) {
    const error: ErrorObject = { error: 'No random game found.' };
    return error;
  }

  return newGameWithRandomPlayer;
};
