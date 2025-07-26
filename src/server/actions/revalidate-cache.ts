'use server';

import type { UpdateAction } from '@/lib/types';
import { revalidateTag } from 'next/cache';

export default async function revalidateCache() {
  revalidateTag('players');
  revalidateTag('lastDatabaseUpdate');
  revalidateTag('playerCount');
  revalidateTag('databaseStats');

  return {
    type: 'success',
    message: 'All cache revalidated successfully.',
  } as UpdateAction;
}
