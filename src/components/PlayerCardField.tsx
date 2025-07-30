import Arrow from '@/components/Arrow';
import type { Match, Player, RangedMatch } from '@/lib/types';
import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

type FieldProps = { children: ReactNode; className?: string };

export function Field({ children, className }: FieldProps) {
  return (
    <div
      className={cn(
        'flex flex-col gap-2 items-center justify-center',
        className
      )}
    >
      {children}
    </div>
  );
}

type FieldNameProps = FieldProps;

export function FieldName({ children, className }: FieldNameProps) {
  return (
    <p
      className={cn(
        'flex gap-2 lg:gap-1 items-center text-sm min-h-[20px]',
        className
      )}
    >
      {children}
    </p>
  );
}

type FieldValueProps =
  | {
      type: 'guess';
      children: ReactNode;
      fieldName: string;
      comparisonResult?: Match | RangedMatch;
    }
  | { type: 'playerToFind'; children?: ReactNode };

export function FieldValue(props: FieldValueProps) {
  const { children, type } = props;

  if (type === 'playerToFind') {
    return (
      <p
        className={cn(
          children
            ? 'bg-good-guess text-good-guess-foreground'
            : 'bg-muted-foreground text-muted',
          'p-2 rounded-md w-full text-center min-h-[40px] flex justify-center items-center'
        )}
      >
        {children}
      </p>
    );
  }

  if (type === 'guess') {
    const { fieldName, comparisonResult } = props;

    function getRightFieldColour() {
      if (comparisonResult === undefined) {
        return 'bg-muted-foreground text-muted';
      } else if (comparisonResult === 'match') {
        return 'bg-good-guess text-good-guess-foreground';
      } else {
        return 'bg-wrong-guess text-wrong-guess-foreground opacity-80 dark:opacity-100';
      }
    }

    return (
      <p
        className={cn(
          getRightFieldColour(),
          'flex justify-center items-center p-2 rounded-md w-full text-center min-h-[40px]'
        )}
      >
        {children}
        {comparisonResult === 'higher' ? (
          <Arrow type="higher">{fieldName}</Arrow>
        ) : null}
        {comparisonResult === 'lower' ? (
          <Arrow type="lower">{fieldName}</Arrow>
        ) : null}
      </p>
    );
  }
}

type FieldValueBestResult = {
  fieldNameBestResult: string;
  fieldNameYearBestResult: string;
  bestResult:
    | Player['bestResultPDC']
    | Player['bestResultWDF']
    | Player['bestResultUKOpen'];
  yearBestResult: Player['yearOfBestResultPDC'] | Player['yearOfBestResultWDF'];
  comparisonBestResult?: RangedMatch;
  comparisonYearBestResult?: RangedMatch;
};

export function FieldValueBestResult(props: FieldValueBestResult) {
  const {
    bestResult,
    yearBestResult,
    fieldNameBestResult,
    fieldNameYearBestResult,
    comparisonBestResult,
    comparisonYearBestResult,
  } = props;

  function getRightResultColour() {
    if (comparisonBestResult === undefined) {
      return 'bg-muted-foreground text-muted';
    } else if (comparisonBestResult === 'match') {
      return 'bg-good-guess text-good-guess-foreground';
    } else {
      return 'bg-wrong-guess text-wrong-guess-foreground opacity-80 dark:opacity-100';
    }
  }

  function getRightYearColour() {
    if (comparisonYearBestResult === undefined) {
      return 'bg-muted-foreground text-muted';
    } else if (comparisonYearBestResult === 'match') {
      return 'bg-good-guess text-good-guess-foreground';
    } else {
      return 'bg-wrong-guess text-wrong-guess-foreground opacity-80 dark:opacity-100';
    }
  }

  return (
    <div className="grid grid-cols-2 w-full text-center min-h-[40px]">
      <p
        className={cn(
          getRightResultColour(),
          'flex justify-end items-center rounded-l-md py-2 px-0.75'
        )}
      >
        {bestResult}
        {comparisonBestResult === 'higher' ? (
          <Arrow type="higher" bestResult="better">
            {fieldNameBestResult}
          </Arrow>
        ) : comparisonBestResult === 'lower' ? (
          <Arrow type="lower" bestResult="worse">
            {fieldNameBestResult}
          </Arrow>
        ) : undefined}
      </p>
      <p
        className={cn(
          getRightYearColour(),
          'flex justify-start items-center rounded-r-md py-2 px-0.75'
        )}
      >
        ({yearBestResult}
        {comparisonYearBestResult === 'higher' ? (
          <Arrow type="higher">{fieldNameYearBestResult}</Arrow>
        ) : comparisonYearBestResult === 'lower' ? (
          <Arrow type="lower">{fieldNameYearBestResult}</Arrow>
        ) : undefined}
        )
      </p>
    </div>
  );
}
