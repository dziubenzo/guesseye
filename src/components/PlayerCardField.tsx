import { Match, MatchHigherLower, Player } from '@/lib/types';
import { ReactNode } from 'react';
import Arrow from './Arrow';

type FieldProps = { children: ReactNode; className?: string };

export function Field({ children, className }: FieldProps) {
  return (
    <div
      className={`flex flex-col gap-2 items-center justify-center ${className ? className : ''}`}
    >
      {children}
    </div>
  );
}

type FieldNameProps = FieldProps;

export function FieldName({ children, className }: FieldNameProps) {
  return (
    <p
      className={`flex gap-2 lg:gap-1 items-center text-sm min-h-[20px] ${className ? className : ''}`}
    >
      {children}
    </p>
  );
}

type FieldValueProps = Pick<FieldProps, 'children'> & {
  fieldName: string;
  comparisonResult: Match | MatchHigherLower;
};

export function FieldValue({
  children,
  fieldName,
  comparisonResult,
}: FieldValueProps) {
  return (
    <p
      className={`${comparisonResult === 'match' ? 'bg-good-guess' : 'bg-wrong-guess'} ${comparisonResult === 'match' ? 'text-good-guess-foreground' : 'text-wrong-guess-foreground'} p-2 rounded-md w-full text-center min-h-[40px] flex justify-center items-center gap-1`}
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

type FieldValueBestResult = {
  fieldNameBestResult: string;
  fieldNameYearBestResult: string;
  bestResult?: Player['bestResultPDC'] | Player['bestResultWDF'];
  yearBestResult?:
    | Player['yearOfBestResultPDC']
    | Player['yearOfBestResultWDF'];
  comparisonBestResult: MatchHigherLower;
  comparisonYearBestResult: MatchHigherLower;
};

export function FieldValueBestResult({
  fieldNameBestResult,
  fieldNameYearBestResult,
  bestResult,
  yearBestResult,
  comparisonBestResult,
  comparisonYearBestResult,
}: FieldValueBestResult) {
  return (
    <p
      className={`${comparisonBestResult === 'match' ? 'bg-good-guess' : 'bg-wrong-guess'} ${comparisonBestResult === 'match' ? 'text-good-guess-foreground' : 'text-wrong-guess-foreground'} p-2 rounded-md w-full text-center min-h-[40px] flex justify-center items-center gap-1`}
    >
      {bestResult}
      {comparisonBestResult === 'higher' ? (
        <Arrow type="higher">{fieldNameBestResult}</Arrow>
      ) : comparisonBestResult === 'lower' ? (
        <Arrow type="lower">{fieldNameBestResult}</Arrow>
      ) : undefined}
      <span
        className={`${comparisonYearBestResult === 'match' ? 'bg-good-guess' : 'bg-wrong-guess'} ${comparisonYearBestResult === 'match' ? 'text-good-guess-foreground' : 'text-wrong-guess-foreground'} text-center flex justify-center items-center gap-1 rounded-sm`}
      >
        ({yearBestResult}
        {comparisonYearBestResult === 'higher' ? (
          <Arrow type="higher">{fieldNameYearBestResult}</Arrow>
        ) : comparisonYearBestResult === 'lower' ? (
          <Arrow type="lower">{fieldNameYearBestResult}</Arrow>
        ) : undefined}
        )
      </span>
    </p>
  );
}
