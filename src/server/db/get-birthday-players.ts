'use server';

import type { BirthdayPlayer } from '@/lib/types';
import { getAge, hasBirthdayOn } from '@/lib/utils';
import { getPlayers } from '@/server/db/get-players';
import { cacheLife, cacheTag } from 'next/cache';

export const getBirthdayPlayers = async () => {
  'use cache';
  cacheLife('days');
  cacheTag('birthdayPlayers');

  const { players } = await getPlayers();

  const birthdayPlayers: BirthdayPlayer[] = [];

  players.forEach((player) => {
    if (!player.dateOfBirth || player.status === 'deceased') return;

    const playerHasBirthday = hasBirthdayOn(new Date(), player.dateOfBirth);

    if (playerHasBirthday) {
      const fullName = player.firstName + ' ' + player.lastName;
      const age = getAge(player.dateOfBirth);
      birthdayPlayers.push({ fullName, age });
    }
  });

  const birthdayPlayersSorted = birthdayPlayers.sort((a, b) => a.age - b.age);

  return birthdayPlayersSorted;
};
