'use server';

import type {
  ErrorObject,
  OfficialGame,
  ScheduleWithPlayer,
} from '@/lib/types';
import { db } from '@/server/db/index';
import { game, guess } from '@/server/db/schema';
import { getUserOrGuest } from '@/server/utils';
import { and, desc, eq } from 'drizzle-orm';

export const findOfficialGame = async (scheduledPlayer: ScheduleWithPlayer) => {
  const { session } = await getUserOrGuest();

  if (!session) {
    const error: ErrorObject = { error: 'You are not logged in.' };
    return error;
  }

  const existingGame: OfficialGame | undefined = await db.query.game.findFirst({
    where: and(
      eq(game.userId, session.user.id),
      eq(game.scheduledPlayerId, scheduledPlayer.id),
      eq(game.mode, 'official')
    ),
    with: {
      guesses: {
        with: { player: true },
        orderBy: desc(guess.time),
      },
    },
  });

  return existingGame;
};
