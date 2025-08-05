import { gameWonGivenUpChildVariant } from '@/lib/motion-variants';
import { motion } from 'motion/react';
import Link from 'next/link';

export default function WhileYouWaitInfo() {
  return (
    <motion.div className="text-sm" variants={gameWonGivenUpChildVariant}>
      <p>While you wait, you can always have a go at a </p>
      <Link href="/random" className="font-medium underline underline-offset-2">
        random game
      </Link>{' '}
      or{' '}
      <Link
        href="/official"
        className="font-medium underline underline-offset-2"
      >
        previous official games
      </Link>
      .
    </motion.div>
  );
}
