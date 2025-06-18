'use server';

import type {
  ErrorObject,
  OfficialGame,
  ScheduleWithPlayer,
} from '@/lib/types';
import { db } from '@/server/db/index';
import { game } from '@/server/db/schema';
import { getUserOrGuest } from '@/server/utils';
import { and, eq } from 'drizzle-orm';

export const findOfficialGame = async (scheduledPlayer: ScheduleWithPlayer) => {
  const { session } = await getUserOrGuest();

  if (!session) {
    const error: ErrorObject = { error: 'No session found.' };
    return error;
  }

  const existingGame: OfficialGame | undefined = await db.query.game.findFirst({
    where: and(
      eq(game.userId, session.user.id),
      eq(game.scheduledPlayerId, scheduledPlayer.id),
      eq(game.gameMode, 'official')
    ),
    with: {
      guesses: {
        with: { player: true },
      },
    },
  });

  return existingGame;
};
