'use client';

import Tooltip from '@/components/Tooltip';
import { useGameStore } from '@/lib/game-store';

export default function ModeIndicator() {
  const { mode } = useGameStore();

  return (
    <span className="place-self-center sm:place-self-end text-lg opacity-75 sm:rotate-4 p-2 flex gap-1">
      {mode === 'official' ? 'Official Mode' : 'Random Mode'}
      <Tooltip>
        {mode === 'official' ? (
          <p>
            In the <span className="font-medium">official</span> mode, a
            hand-picked darts player is selected for you to guess every day. You
            can also play previous official mode darts players on the Previous
            Official Games page.
          </p>
        ) : (
          <p>
            In the <span className="font-medium">random</span> mode, a random
            darts player is assigned for you to guess. The darts player changes
            when you either guess it correctly or give up on your game.
          </p>
        )}
      </Tooltip>
    </span>
  );
}
