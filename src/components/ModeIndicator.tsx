'use client';

import Bold from '@/components/Bold';
import Tooltip from '@/components/Tooltip';
import { useGameStore } from '@/lib/game-store';
import Link from 'next/link';

type ModeIndicatorProps = {
  allowVeryHard?: boolean;
};

export default function ModeIndicator({ allowVeryHard }: ModeIndicatorProps) {
  const { mode } = useGameStore();

  return (
    <span className="place-self-center sm:place-self-end text-lg opacity-75 p-2 flex gap-1">
      {mode === 'official' ? 'Official Mode' : 'Random Mode'}
      <Tooltip>
        {mode === 'official' ? (
          <p>
            In the <Bold>official</Bold> mode, a hand-picked darts player is
            available for you to find every day. You can also play previous
            official mode darts players on the{' '}
            <Link
              href="/official"
              className="font-medium underline underline-offset-2"
            >
              Previous Official Games page
            </Link>
            .
          </p>
        ) : (
          <p>
            In the <Bold>random</Bold> mode, a random darts player of{' '}
            <Bold>
              {allowVeryHard
                ? 'any'
                : allowVeryHard === false
                  ? 'easy, medium, or hard'
                  : 'easy or medium'}
            </Bold>{' '}
            difficulty is assigned for you to guess. The darts player changes
            when you either guess it correctly or give up on your game.
          </p>
        )}
      </Tooltip>
    </span>
  );
}
