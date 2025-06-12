'use server';

import type { OfficialGame, ScheduleWithPlayer } from '@/lib/types';
import { db } from '@/server/db/index';
import { game } from '@/server/db/schema';
import { getUserOrGuest } from '@/server/utils';
import { and, eq } from 'drizzle-orm';

export const findOfficialGame = async (scheduledPlayer: ScheduleWithPlayer) => {
  const { session, clientIP, clientUserAgent } = await getUserOrGuest();

  const existingGame: OfficialGame | undefined = await db.query.game.findFirst({
    where: session
      ? and(
          eq(game.userId, session.user.id),
          eq(game.scheduledPlayerId, scheduledPlayer.id),
          eq(game.gameMode, 'official')
        )
      : and(
          eq(game.guestIp, clientIP),
          eq(game.guestUserAgent, clientUserAgent),
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
