'use server';

import type {
  GameWithGuesses,
  ScheduleWithPlayer
} from '@/lib/types';
import { db } from '@/server/db/index';
import { game } from '@/server/db/schema';
import { getUserOrGuest } from '@/server/utils';
import { and, eq } from 'drizzle-orm';

export const getGame = async (scheduledPlayer: ScheduleWithPlayer) => {
  const { session, clientIP, clientUserAgent } = await getUserOrGuest();

  const existingGame: GameWithGuesses | undefined =
    await db.query.game.findFirst({
      where: session
        ? and(
            eq(game.userId, session.user.id),
            eq(game.scheduledPlayerId, scheduledPlayer.id)
          )
        : and(
            eq(game.guestIp, clientIP),
            eq(game.guestUserAgent, clientUserAgent),
            eq(game.scheduledPlayerId, scheduledPlayer.id)
          ),
      with: {
        guesses: {
          with: { player: true },
        },
      },
    });

  return existingGame;
};
