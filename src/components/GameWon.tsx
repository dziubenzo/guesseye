'use client';

import TimeLeftTooltip from '@/components/TimeLeftTooltip';
import { Separator } from '@/components/ui/separator';
import WhileYouWaitInfo from '@/components/WhileYouWaitInfo';
import { useUpdateTimeLeft } from '@/lib/hooks';
import {
  gameWonGivenUpChildVariant,
  gameWonGivenUpParentVariant,
} from '@/lib/motion-variants';
import type { GameWon as GameWonType } from '@/lib/types';
import { Trophy } from 'lucide-react';
import { motion } from 'motion/react';

type GameWonProps = {
  previousGame: GameWonType;
};

export default function GameWon({ previousGame }: GameWonProps) {
  const { attempts, fullName, nextPlayerDifficulty, nextPlayerStartDate } =
    previousGame;
  const { timeLeft, timeInSeconds } = useUpdateTimeLeft(nextPlayerStartDate);

  return (
    <motion.div
      className="flex flex-col grow-1 justify-center text-center items-center gap-4 mt-8"
      initial="hidden"
      animate="visible"
      variants={gameWonGivenUpParentVariant}
    >
      <motion.div
        initial={{ scale: 0, rotateZ: 180, opacity: 0 }}
        animate={{ scale: 1, rotateZ: 0, opacity: 1 }}
        transition={{ duration: 1.2 }}
      >
        <Trophy size={128} className="dark:text-yellow-300" />
      </motion.div>
      <motion.p variants={gameWonGivenUpChildVariant}>You found</motion.p>
      <motion.div variants={gameWonGivenUpChildVariant}>
        <p className="text-xl lg:text-2xl bg-good-guess text-background px-8 py-2 rounded-md">
          {fullName}
        </p>
      </motion.div>
      <motion.p variants={gameWonGivenUpChildVariant}>in</motion.p>
      <motion.div variants={gameWonGivenUpChildVariant}>
        <p className="text-xl lg:text-2xl bg-good-guess text-background px-8 py-2 rounded-md">
          {attempts}
        </p>
      </motion.div>
      <motion.p variants={gameWonGivenUpChildVariant}>
        {attempts === 1 ? 'try' : 'tries.'}
      </motion.p>
      <Separator />
      <motion.div variants={gameWonGivenUpChildVariant}>
        <p>The next darts player unlocks in</p>
      </motion.div>
      <motion.div
        className="flex gap-2 items-start relative"
        variants={gameWonGivenUpChildVariant}
      >
        <p
          className="text-xl lg:text-2xl bg-good-guess text-background px-6 py-2 rounded-md"
          suppressHydrationWarning
        >
          {timeLeft}
        </p>
        <TimeLeftTooltip nextPlayerStartDate={nextPlayerStartDate} />
      </motion.div>
      <motion.p variants={gameWonGivenUpChildVariant}>or</motion.p>
      <motion.div variants={gameWonGivenUpChildVariant}>
        <p
          className="text-xl lg:text-2xl bg-good-guess text-background px-8 py-2 rounded-md"
          suppressHydrationWarning
        >
          {timeInSeconds}
        </p>
      </motion.div>
      <motion.p variants={gameWonGivenUpChildVariant}>
        {' '}
        {timeInSeconds === 1 ? 'second' : 'seconds'}
      </motion.p>
      <motion.p variants={gameWonGivenUpChildVariant}>
        and their difficulty is
      </motion.p>
      <motion.div variants={gameWonGivenUpChildVariant}>
        <p className="text-xl lg:text-2xl bg-good-guess text-background px-8 py-2 rounded-md">
          {nextPlayerDifficulty}
        </p>
      </motion.div>
      <WhileYouWaitInfo />
    </motion.div>
  );
}
