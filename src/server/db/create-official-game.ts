'use server';

import type { Game, Schedule, ScheduleWithPlayer } from '@/lib/types';
import { db } from '@/server/db/index';
import { game } from '@/server/db/schema';
import { getUserOrGuest } from '@/server/utils';

export const createOfficialGame = async (
  scheduledPlayer: Schedule | ScheduleWithPlayer
) => {
  const { session, clientIP, clientUserAgent } = await getUserOrGuest();

  const newGame: Game[] = await db
    .insert(game)
    .values({
      userId: session ? session.user.id : null,
      guestIp: !session ? clientIP : null,
      guestUserAgent: !session ? clientUserAgent : null,
      scheduleId: scheduledPlayer.id,
      startDate: new Date(),
      mode: 'official',
    })
    .returning();

  return newGame[0];
};
