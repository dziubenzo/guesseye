'use server';

import { getScheduledPlayer } from '@/server/db/get-scheduled-player';
import { db } from '@/server/db/index';
import { game } from '@/server/db/schema';
import { getUserOrGuest } from '@/server/utils';
import { and, eq } from 'drizzle-orm';

export const getGameAndPlayer = async () => {
  const { session, clientIP, clientUserAgent } = await getUserOrGuest();

  const scheduledPlayer = await getScheduledPlayer();

  if (!scheduledPlayer) return { scheduledPlayer: undefined };

  // Check if game exist
  const existingGame = await db.query.game.findFirst({
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

  return { existingGame, scheduledPlayer };
};
