import type { PlayerToFindMatch } from '@/lib/types';
import { Check, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

type GuessIndicatorProps = {
  previousMatch?: PlayerToFindMatch;
  currentMatch?: PlayerToFindMatch;
};

export default function GuessIndicator({
  previousMatch,
  currentMatch,
}: GuessIndicatorProps) {
  const { theme } = useTheme();
  const [match, setMatch] = useState<'good' | 'wrong' | null>(null);

  useEffect(() => {
    // First and last name, good guess
    if (
      typeof previousMatch === 'string' &&
      previousMatch[0] === '?' &&
      typeof currentMatch === 'string' &&
      currentMatch[0] !== '?'
    ) {
      setMatch('good');
      // Non-comparable values, good guess
    } else if (
      previousMatch === undefined &&
      currentMatch !== undefined &&
      typeof currentMatch !== 'object'
    ) {
      setMatch('good');
    } // Comparable values, no guess to good guess
    else if (
      previousMatch === undefined &&
      currentMatch !== undefined &&
      typeof currentMatch === 'object' &&
      currentMatch?.type === 'match'
    ) {
      setMatch('good');
      // Comparable values, no guess to wrong guess
    } else if (
      previousMatch === undefined &&
      currentMatch !== undefined &&
      typeof currentMatch === 'object' &&
      (currentMatch?.type === 'higher' || currentMatch?.type === 'lower')
    ) {
      setMatch('wrong');
      // Comparable values, wrong guess to good guess
    } else if (
      previousMatch !== undefined &&
      typeof previousMatch === 'object' &&
      (previousMatch?.type === 'higher' || previousMatch?.type === 'lower') &&
      currentMatch !== undefined &&
      typeof currentMatch === 'object' &&
      currentMatch?.type === 'match'
    ) {
      setMatch('good');
    }
  }, [previousMatch, currentMatch]);

  return (
    <AnimatePresence>
      {match === 'good' ? (
        <motion.span
          className="absolute block z-5 bg-good-guess rounded-full p-1"
          initial={{
            top: 8,
            right: 8,
            scale: 1,
            opacity: 0,
          }}
          animate={{
            top: -35,
            right: -5,
            scale: 0.8,
            rotate: 360 * 2,
            opacity: 1,
          }}
          exit={{ scale: 1, opacity: 0 }}
          transition={{
            duration: 0.6,
          }}
          onAnimationComplete={() => setMatch(null)}
        >
          <Check size={24} color={theme === 'dark' ? 'black' : 'white'} />
        </motion.span>
      ) : match === 'wrong' ? (
        <motion.span
          className="absolute block bg-wrong-guess rounded-full p-1"
          initial={{
            top: 8,
            right: 8,
            scale: 1,
            opacity: 0,
          }}
          animate={{
            top: -35,
            right: -5,
            scale: 0.8,
            rotate: 360 * 2,
            opacity: 1,
          }}
          transition={{
            duration: 0.6,
          }}
          exit={{ scale: 1, opacity: 0 }}
          onAnimationComplete={() => setMatch(null)}
        >
          <X size={24} color={theme === 'dark' ? 'black' : 'white'} />
        </motion.span>
      ) : null}
    </AnimatePresence>
  );
}
