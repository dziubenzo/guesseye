'use server';

import type { Player } from '@/lib/types';
import { findLastRandomGamePlayerId } from '@/server/db/find-last-random-game-player-id';
import { db } from '@/server/db/index';
import { player } from '@/server/db/schema';
import { eq, ne, or, sql } from 'drizzle-orm';

type GetRandomPlayerOptions = {
  easierForGuests?: boolean;
  allowVeryHard?: boolean;
};

export const getRandomPlayer = async ({
  easierForGuests,
  allowVeryHard,
}: GetRandomPlayerOptions) => {
  const previousPlayerId = await findLastRandomGamePlayerId();
  let randomPlayer: Player | undefined = undefined;

  // Make sure that the new darts player in random mode differs from the previous darts player in random mode
  do {
    randomPlayer = await db.query.player.findFirst({
      where: easierForGuests
        ? or(eq(player.difficulty, 'easy'), eq(player.difficulty, 'medium'))
        : allowVeryHard
          ? undefined
          : ne(player.difficulty, 'very hard'),
      orderBy: sql`RANDOM()`,
    });
  } while (previousPlayerId === randomPlayer?.id);

  return randomPlayer;
};
