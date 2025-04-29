'use client';

import { useGameStore } from '@/lib/game-store';
import PlayerCard from './PlayerCard';

export default function PlayerToFindCard() {
  const { playerToFind, playerToFindMatches } = useGameStore();

  return (
    <PlayerCard
      type={'playerToFind'}
      player={playerToFind ? playerToFind : playerToFindMatches}
    />
  );
}
