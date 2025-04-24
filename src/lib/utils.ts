import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { differenceInYears } from 'date-fns';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getAge(dateOfBirth: Date | string) {
  return differenceInYears(new Date(), dateOfBirth);
}

export function capitalise(string: string) {
  const splitString = string.split('-');

  // Capitalise laterality
  if (splitString.length === 2) {
    return (
      splitString[0][0].toUpperCase() +
      splitString[0].slice(1) +
      '-' +
      splitString[1][0].toUpperCase() +
      splitString[1].slice(1)
    );
  }

  return string[0].toUpperCase() + string.slice(1);
}

export function formatPrizeMoney(prizeMoney: number) {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
    trailingZeroDisplay: 'stripIfInteger',
  }).format(prizeMoney * 1000);
}
