import { ALL_MATCHES } from '@/lib/constants';
import { useGameStore } from '@/lib/game-store';
import type { Schedule } from '@/lib/types';
import { formatDistanceStrict } from 'date-fns';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export const useUpdateProgressBar = () => {
  const { playerToFindMatches, gameOver } = useGameStore();
  const [fieldsFound, setFieldsFound] = useState(
    Object.keys(playerToFindMatches).length
  );

  useEffect(() => {
    function calculateFieldsFound() {
      let count = 0;

      const array = Object.entries(playerToFindMatches);

      for (const pair of array) {
        const value = pair[1];
        
        if (
          (typeof value !== 'object' && value) ||
          (typeof value === 'object' && value?.type === 'match')
        ) {
          count++;
        }
      }

      return count;
    }

    if (gameOver) {
      setFieldsFound(ALL_MATCHES);
      return;
    }

    const currentFields = calculateFieldsFound();
    setFieldsFound(currentFields);
  }, [playerToFindMatches, gameOver]);

  return fieldsFound;
};

export const useUpdateTimeLeft = (
  nextPlayerStartDate: Schedule['startDate']
) => {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());
  const [timeInSeconds, setTimeInSeconds] = useState(calculateTimeInSeconds());
  const router = useRouter();

  function calculateTimeLeft() {
    return formatDistanceStrict(nextPlayerStartDate, new Date());
  }

  function calculateTimeInSeconds() {
    const seconds =
      (nextPlayerStartDate.getTime() - new Date().getTime()) / 1000;
    return Number(seconds.toFixed(0));
  }

  useEffect(() => {
    const interval = setInterval(() => {
      // Refresh the page if the next player is available to play
      if (new Date().getTime() > nextPlayerStartDate.getTime()) {
        router.refresh();
        return;
      }
      setTimeLeft(calculateTimeLeft());
      setTimeInSeconds(calculateTimeInSeconds());
    }, 1000);
    return () => {
      clearTimeout(interval);
    };
  }, [nextPlayerStartDate]);

  return { timeLeft, timeInSeconds };
};
