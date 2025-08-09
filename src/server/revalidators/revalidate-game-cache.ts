'use server';

import type { GameMode } from '@/lib/types';
import { revalidatePath } from 'next/cache';

export default async function revalidateGameCache(
  mode: GameMode,
  scheduleId: string | undefined
) {
  if (mode === 'official') {
    if (scheduleId) {
      revalidatePath(`/official/${scheduleId}`);
    }
    revalidatePath('/');
  } else {
    revalidatePath('/random');
    revalidatePath('/');
  }

  return;
}
