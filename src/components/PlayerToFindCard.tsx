'use client';

import { useGameStore } from '@/lib/game-store';
import PlayerCard from './PlayerCard';

export default function PlayerToFindCard() {
  const { playerToFind, playerToFindMatches } = useGameStore();

  return (
    <>
      <h1 className="text-2xl opacity-50">Player To Find</h1>
      <PlayerCard
        type={'playerToFind'}
        player={playerToFind ? playerToFind : playerToFindMatches}
      />
    </>
  );
}
