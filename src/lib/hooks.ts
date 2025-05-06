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
    setFieldsFound(currentFields);
  }, [playerToFindMatches, gameOver]);

  return [fieldsFound];
};
