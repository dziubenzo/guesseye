'use server';

import type { RandomGame } from '@/lib/types';
import { db } from '@/server/db/index';
import { game } from '@/server/db/schema';
import { getUserOrGuest } from '@/server/utils';
import { and, desc, eq, ne } from 'drizzle-orm';

export const findLastRandomGamePlayerId = async () => {
  const { session, clientIP, clientUserAgent } = await getUserOrGuest();

  const lastCompletedRandomGame: Pick<RandomGame, 'randomPlayerId'> | undefined =
    await db.query.game.findFirst({
      where: session
        ? and(
            eq(game.userId, session.user.id),
            eq(game.mode, 'random'),
            ne(game.status, 'inProgress')
          )
        : and(
            eq(game.guestIp, clientIP),
            eq(game.guestUserAgent, clientUserAgent),
            eq(game.mode, 'random'),
            ne(game.status, 'inProgress')
          ),
      columns: { randomPlayerId: true },
      orderBy: desc(game.startDate)
    });

  if (!lastCompletedRandomGame) return null;

  return lastCompletedRandomGame.randomPlayerId;
};
