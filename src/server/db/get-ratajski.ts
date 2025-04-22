import { db } from '@/server/db/index';
import { unstable_cache } from 'next/cache';

export const getRatajski = unstable_cache(async () => {
  return await db.query.player.findFirst();
});
