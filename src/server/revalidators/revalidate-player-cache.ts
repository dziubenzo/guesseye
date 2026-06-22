'use server';

import type { UpdateAction } from '@/lib/types';
import { updateTag } from 'next/cache';

export default async function revalidatePlayerCache() {
  const cacheTypes: string[] = [
    'players',
    'playersAddHint',
    'playersSchedulePlayer',
    'lastDatabaseUpdate',
    'playerCount',
    'databaseStats',
    'birthdayPlayers',
    'fullNames',
    'suggestedHints',
    'hintCountsStats',
    'playersSuggestHint',
    'hintCountsSuggestHint',
  ];

  for (const cache of cacheTypes) {
    updateTag(cache);
  }

  return {
    type: 'success',
    message: `All cache (${cacheTypes.join(', ')}) revalidated successfully.`,
  } as UpdateAction;
}
