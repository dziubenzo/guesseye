import type { PlayerToFindMatch } from '@/lib/types';
import { Check, CircleX } from 'lucide-react';
import { motion } from 'motion/react';
import { useEffect, useState } from 'react';

type GuessIndicatorProps = {
  previousMatch?: PlayerToFindMatch;
  currentMatch?: PlayerToFindMatch;
};

export default function GuessIndicator({
  previousMatch,
  currentMatch,
}: GuessIndicatorProps) {
  const [match, setMatch] = useState<'good' | 'wrong' | null>(null);

  useEffect(() => {
    // Non-comparable values, good guess
    if (
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

  if (match === 'good') {
    return (
      <motion.span
        className="absolute z-5 bg-good-guess rounded-full p-1"
        initial={{ top: 0, right: 0, scale: 1 }}
        animate={{ top: -25, right: -25, scale: 0.75, rotate: '360deg' }}
        transition={{ duration: 1.5 }}
        onAnimationComplete={() => setMatch(null)}
      >
        <Check size={24} />
      </motion.span>
    );
  }

  if (match === 'wrong') {
    return (
      <motion.span
        className="absolute z-5 bg-wrong-guess rounded-full p-1"
        initial={{ top: 0, right: 0, scale: 1 }}
        animate={{ top: -25, right: -25, scale: 0.75, rotate: '360deg' }}
        transition={{ duration: 1.5 }}
        onAnimationComplete={() => setMatch(null)}
      >
        <CircleX size={24} />
      </motion.span>
    );
  }

  return null;
}
