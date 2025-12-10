'use server';

import type { Player } from '@/lib/types';
import { db } from '@/server/db/index';
import { player } from '@/server/db/schema';
import { eq, ne, or, sql } from 'drizzle-orm';

type GetRandomPlayerOptions = {
  easierForGuests?: boolean;
  allowVeryHard?: boolean;
};

export const getRandomPlayer = async (options: GetRandomPlayerOptions) => {
  const { easierForGuests, allowVeryHard } = options;

  const randomPlayer: Player | undefined = await db.query.player.findFirst({
    where: easierForGuests
      ? or(eq(player.difficulty, 'easy'), eq(player.difficulty, 'medium'))
      : allowVeryHard
        ? undefined
        : ne(player.difficulty, 'very hard'),
    orderBy: sql`RANDOM()`,
  });

  return randomPlayer;
};
