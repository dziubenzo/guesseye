'use server';

import type { Schedule } from '@/lib/types';
import { db } from '@/server/db/index';
import { game } from '@/server/db/schema';
import { getUserOrGuest } from '@/server/utils';

export const createGame = async (scheduledPlayer: Schedule) => {
  const { session, clientIP, clientUserAgent } = await getUserOrGuest();

  await db.insert(game).values({
    userId: session ? session.user.id : null,
    guestIp: !session ? clientIP : null,
    guestUserAgent: !session ? clientUserAgent : null,
    scheduledPlayerId: scheduledPlayer.id,
    startDate: new Date(),
    endDate: scheduledPlayer.endDate,
    gameMode: 'official',
  });

  return;
};
