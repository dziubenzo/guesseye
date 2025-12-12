'use server';

import type { UpdateAction } from '@/lib/types';
import { revalidateTag } from 'next/cache';

export default async function revalidatePlayerCache() {
  revalidateTag('players');
  revalidateTag('lastDatabaseUpdate');
  revalidateTag('playerCount');
  revalidateTag('databaseStats');
  revalidateTag('names');

  return {
    type: 'success',
    message: 'All cache revalidated successfully.',
  } as UpdateAction;
}
