'use server';

import type { UpdateAction } from '@/lib/types';
import { revalidateTag } from 'next/cache';

export default async function revalidatePlayerCache() {
  const cacheTypes: string[] = [
    'players',
    'playersAdmin',
    'lastDatabaseUpdate',
    'playerCount',
    'databaseStats',
    'fullNames',
    'suggestedHints',
    'hintsCounts',
    'playersSuggestHint',
    'hintCount',
  ];

  for (const cache of cacheTypes) {
    revalidateTag(cache);
  }

  return {
    type: 'success',
    message: `All cache (${cacheTypes.join(', ')}) revalidated successfully.`,
  } as UpdateAction;
}
