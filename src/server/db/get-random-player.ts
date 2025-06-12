'use server';

import type { Player } from '@/lib/types';
import { db } from '@/server/db/index';
import { player } from '@/server/db/schema';
import { eq, or, sql } from 'drizzle-orm';

type GetRandomPlayerOptions = {
  easierForGuests: boolean;
};

export const getRandomPlayer = async (options?: GetRandomPlayerOptions) => {
  const randomPlayer: Player | undefined = await db.query.player.findFirst({
    where: options?.easierForGuests
      ? or(eq(player.difficulty, 'easy'), eq(player.difficulty, 'medium'))
      : undefined,
    orderBy: sql`RANDOM()`,
  });

  return randomPlayer;
};
