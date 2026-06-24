'use server';

import { getSession } from '@/server/utils';
import { updateTag } from 'next/cache';

export default async function revalidateLeaderboard() {
  const session = await getSession();

  if (session) {
    updateTag('leaderboard');
  }
}
