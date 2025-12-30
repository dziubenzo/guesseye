'use server';

import { db } from '@/server/db/index';
import { hint } from '@/server/db/schema';
import { eq } from 'drizzle-orm';
import { unstable_cache } from 'next/cache';

export const getHintCount = unstable_cache(
  async () => {
    return await db.$count(hint, eq(hint.isApproved, true));
  },
  ['hintCount'],
  { tags: ['hintCount'] }
);
