'use server';

import type { RandomGame } from '@/lib/types';
import { db } from '@/server/db/index';
import { game, guess, hint } from '@/server/db/schema';
import { getUserOrGuest } from '@/server/utils';
import { and, asc, desc, eq } from 'drizzle-orm';

export const findRandomGame = async () => {
  const { session, clientIP, clientUserAgent } = await getUserOrGuest();

  const existingGame: RandomGame | undefined = await db.query.game.findFirst({
    where: session
      ? and(
          eq(game.userId, session.user.id),
          eq(game.mode, 'random'),
          eq(game.status, 'inProgress')
        )
      : and(
          eq(game.guestIp, clientIP),
          eq(game.guestUserAgent, clientUserAgent),
          eq(game.mode, 'random'),
          eq(game.status, 'inProgress')
        ),
    with: {
      randomPlayer: {
        with: {
          hints: {
            columns: {
              createdAt: true,
              hint: true,
            },
            with: {
              user: {
                columns: { name: true },
              },
            },
            where: eq(hint.isApproved, true),
            orderBy: asc(hint.createdAt),
          },
        },
      },
      guesses: {
        with: { player: true },
        orderBy: desc(guess.createdAt),
      },
    },
  });

  return existingGame;
};
