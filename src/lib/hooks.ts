import { useEffect, useState } from 'react';
import { ALL_MATCHES } from './constants';
import { useGameStore } from './game-store';

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
    // Subtract one to account for difficulty in playerToFindMatches as it is not a comparable property
    setFieldsFound(currentFields === 0 ? 0 : currentFields - 1);
  }, [playerToFindMatches, gameOver]);

  return [fieldsFound];
};
