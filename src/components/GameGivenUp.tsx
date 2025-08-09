'use client';

import PlayerCard from '@/components/PlayerCard';
import TimeLeftTooltip from '@/components/TimeLeftTooltip';
import WhileYouWaitInfo from '@/components/WhileYouWaitInfo';
import { useGameStore } from '@/lib/game-store';
import { useUpdateTimeLeft } from '@/lib/hooks';
import {
  gameWonGivenUpChildVariant,
  gameWonGivenUpParentVariant,
} from '@/lib/motion-variants';
import type { GameGivenUp as GameGivenUpType } from '@/lib/types';
import { HeartCrack } from 'lucide-react';
import { motion } from 'motion/react';
import { useEffect } from 'react';

type GameGivenUpProps = {
  previousGame: GameGivenUpType;
};

export default function GameGivenUp({ previousGame }: GameGivenUpProps) {
  const {
    previousPlayer,
    nextPlayerStartDate,
    nextPlayerDifficulty,
    attempts,
    previousPlayerDifficulty,
  } = previousGame;
  const { timeLeft } = useUpdateTimeLeft(nextPlayerStartDate);
  const { updateDifficulty } = useGameStore();

  useEffect(() => {
    updateDifficulty(previousPlayerDifficulty);
  }, [previousPlayerDifficulty]);

  return (
    <motion.div
      className="flex flex-col grow-1 text-center justify-center items-center gap-4 mt-8"
      initial="hidden"
      animate="visible"
      variants={gameWonGivenUpParentVariant}
    >
      <motion.div
        initial={{ scale: 0, rotateZ: 180, opacity: 0 }}
        animate={{ scale: 1, rotateZ: 0, opacity: 1 }}
        transition={{ duration: 1.2 }}
      >
        <HeartCrack size={128} className="text-wrong-guess" />
      </motion.div>
      <motion.h2 className="text-xl" variants={gameWonGivenUpChildVariant}>
        You&apos;ve given up on...
      </motion.h2>
      <PlayerCard
        type="playerToFind"
        previousMatches={previousPlayer}
        currentMatches={previousPlayer}
      />
      {attempts > 0 ? (
        <>
          <motion.p variants={gameWonGivenUpChildVariant}>
            At least, you gave{' '}
            {previousPlayer.gender === 'male' ? 'him' : 'her'}{' '}
            <span className="font-bold">{attempts}</span>{' '}
            {attempts === 1 ? 'try' : 'tries'}. Good job!
          </motion.p>
        </>
      ) : (
        <motion.p variants={gameWonGivenUpChildVariant}>
          And you did not even try to guess{' '}
          {previousPlayer.gender === 'male' ? 'him' : 'her'}...
        </motion.p>
      )}
      <div className="p-4 flex flex-col justify-center items-center gap-2">
        <motion.p className="text-sm" variants={gameWonGivenUpChildVariant}>
          The next darts player (
          <span className="font-medium uppercase">{nextPlayerDifficulty}</span>{' '}
          difficulty) unlocks in
        </motion.p>
        <motion.div className="relative" variants={gameWonGivenUpChildVariant}>
          <p className="font-medium text-2xl" suppressHydrationWarning>
            {timeLeft}
          </p>
          <TimeLeftTooltip nextPlayerStartDate={nextPlayerStartDate} />
        </motion.div>
      </div>
      <WhileYouWaitInfo />
    </motion.div>
  );
}
