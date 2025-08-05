import { NAMED_FIELDS } from '@/lib/constants';
import { stagger } from 'motion/react';

const delayChildren = 0.1;

export const fieldsContainerVariant = {
  visible: {
    transition: {
      when: 'beforeChildren',
      delayChildren: stagger(delayChildren),
    },
  },
};

export const fieldVariant = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

export const cardTopDuration = NAMED_FIELDS * delayChildren;

export const gameWonGivenUpParentVariant = {
  visible: {
    transition: {
      when: 'beforeChildren',
      delayChildren: stagger(0.15),
    },
  },
};

export const gameWonGivenUpChildVariant = {
  hidden: { scale: 0 },
  visible: { scale: 1 },
};
