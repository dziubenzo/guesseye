'use server';

import type { BirthdayPlayer } from '@/lib/types';
import { getAge } from '@/lib/utils';
import { getPlayers } from '@/server/db/get-players';
import { isToday, setYear } from 'date-fns';

export const getBirthdayPlayers = async () => {
  const players = await getPlayers();

  const birthdayPlayers: BirthdayPlayer[] = [];

  for (const player of players) {
    if (!player.dateOfBirth || player.status === 'deceased') continue;

    const currentYearDate = setYear(
      player.dateOfBirth,
      new Date().getFullYear()
    );

    if (isToday(currentYearDate)) {
      const fullName = player.firstName + ' ' + player.lastName;
      const age = getAge(player.dateOfBirth);
      birthdayPlayers.push({ fullName, age });
    }
  }

  return birthdayPlayers;
};
