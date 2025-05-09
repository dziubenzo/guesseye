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
    if (gameOver) {
      setFieldsFound(ALL_MATCHES);
      return;
    }
    const currentFields = Object.keys(playerToFindMatches).length;
    setFieldsFound(currentFields);
  }, [playerToFindMatches, gameOver]);

  return [fieldsFound];
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
    // Refresh the page if the next player is available to play
    if (new Date() > nextPlayerStartDate) {
      router.refresh();
      return;
    }
    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
      setTimeInSeconds(calculateTimeInSeconds());
    }, 1000);
    return () => {
      clearTimeout(interval);
    };
  }, [nextPlayerStartDate]);

  return { timeLeft, timeInSeconds };
};
