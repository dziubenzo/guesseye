'use client';

import { useGameStore } from '@/lib/game-store';
import PlayerCard from './PlayerCard';

export default function Guesses() {
  const { guesses } = useGameStore();

  return guesses.map((guess) => (
    <PlayerCard
      key={guess.guessedPlayer.id}
      type={'guess'}
      player={guess.guessedPlayer}
      comparisonResults={guess.comparisonResults}
    />
  ));
}
