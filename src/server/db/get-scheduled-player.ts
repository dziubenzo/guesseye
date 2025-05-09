'use server';

import type { ScheduleWithPlayer } from '@/lib/types';
import { db } from '@/server/db/index';
import { schedule } from '@/server/db/schema';
import { and, gte, lt } from 'drizzle-orm';

export const getScheduledPlayer = async () => {
  const scheduledPlayer = await db.query.schedule.findFirst({
    where: and(
      lt(schedule.startDate, new Date()),
      gte(schedule.endDate, new Date())
    ),
    with: { playerToFind: true },
  });

  if (!scheduledPlayer) {
    return undefined;
  }

  return scheduledPlayer as ScheduleWithPlayer;
};

// TODO: Handle a case where no darts player is scheduled

// const scheduleRandomPlayer = async () => {
//   const randomPlayer = await db.query.player.findFirst({
//     orderBy: sql`RANDOM()`,
//   });

//   if (!randomPlayer) {
//     return undefined;
//   }

//   await db.insert(schedule).values({
//     playerToFindId: randomPlayer.id,
//     startDate: new Date(),
//   });

//   // Revalidate cached getPlayers() query
//   revalidateTag('players');

//   const newlyScheduledPlayer = await db.query.schedule.findFirst({
//     where: and(
//       lt(schedule.startDate, new Date()),
//       gte(schedule.endDate, new Date())
//     ),
//     with: { playerToFind: true },
//   });

//   return newlyScheduledPlayer;
// };
