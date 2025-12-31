import Arrow from '@/components/Arrow';
import Bold from '@/components/Bold';
import GuessIndicator from '@/components/GuessIndicator';
import { fieldVariant } from '@/lib/motion-variants';
import type {
  Match,
  Player,
  PlayerToFindMatch,
  RangedMatch,
} from '@/lib/types';
import { cn } from '@/lib/utils';
import { motion } from 'motion/react';
import { ReactNode } from 'react';

type FieldProps = {
  children: ReactNode;
  className?: string;
};

export function Field({ children, className }: FieldProps) {
  return (
    <motion.div
      className={cn(
        'flex flex-col gap-2 items-center justify-center',
        className
      )}
      variants={fieldVariant}
    >
      {children}
    </motion.div>
  );
}

type FieldNameProps = FieldProps;

export function FieldName({ children, className }: FieldNameProps) {
  return (
    <p
      className={cn(
        'flex gap-2 items-center text-sm min-h-[20px]',
        className
      )}
    >
      {children}
    </p>
  );
}

type ValueType =
  | 'age'
  | 'playingSince'
  | 'ranking'
  | 'dartsWeight'
  | 'nineDartersPDC';

type FieldValueProps =
  | {
      type: 'guess';
      children: ReactNode;
      fieldName: string;
      valueType?: ValueType;
      comparisonResult?: Match | RangedMatch;
      previousMatch?: PlayerToFindMatch;
      currentMatch?: PlayerToFindMatch;
    }
  | {
      type: 'playerToFind';
      children?: ReactNode;
      previousMatch?: PlayerToFindMatch;
      currentMatch?: PlayerToFindMatch;
    };

export function FieldValue(props: FieldValueProps) {
  const { children, type, previousMatch, currentMatch } = props;

  if (type === 'playerToFind') {
    return (
      <p
        className={cn(
          children
            ? 'bg-good-guess text-good-guess-foreground'
            : 'bg-muted-foreground text-muted',
          'p-2 rounded-md w-full text-center min-h-[40px] flex justify-center items-center relative'
        )}
      >
        {children}
        <GuessIndicator
          previousMatch={previousMatch}
          currentMatch={currentMatch}
        />
      </p>
    );
  }

  if (type === 'guess') {
    const { fieldName, comparisonResult, valueType } = props;

    function getRightFieldColour() {
      if (comparisonResult === undefined) {
        return 'bg-muted-foreground text-muted';
      } else if (comparisonResult === 'match') {
        return 'bg-good-guess text-good-guess-foreground';
      } else {
        return 'bg-wrong-guess text-wrong-guess-foreground opacity-80 dark:opacity-100';
      }
    }

    function getLowerDescription(valueType: ValueType | undefined) {
      switch (valueType) {
        case 'age':
          return 'younger';
        case 'playingSince':
          return 'earlier';
        case 'ranking':
          return 'worse (number should be higher)';
        case 'dartsWeight':
          return 'lighter';
        case 'nineDartersPDC':
          return 'lower';
        default:
          return 'lower';
      }
    }

    function getHigherDescription(valueType: ValueType | undefined) {
      switch (valueType) {
        case 'age':
          return 'older';
        case 'playingSince':
          return 'later';
        case 'ranking':
          return 'better (number should be lower)';
        case 'dartsWeight':
          return 'heavier';
        case 'nineDartersPDC':
          return 'higher';
        default:
          return 'higher';
      }
    }

    return (
      <p
        className={cn(
          getRightFieldColour(),
          'flex justify-center items-center p-2 rounded-md w-full text-center min-h-[40px] relative'
        )}
      >
        {children}
        {comparisonResult === 'higher' ? (
          <Arrow type="higher">
            {fieldName} should be <Bold>{getHigherDescription(valueType)}</Bold>
            .
          </Arrow>
        ) : null}
        {comparisonResult === 'lower' ? (
          <Arrow type="lower">
            {fieldName} should be <Bold>{getLowerDescription(valueType)}</Bold>.
          </Arrow>
        ) : null}
        <GuessIndicator
          previousMatch={previousMatch}
          currentMatch={currentMatch}
        />
      </p>
    );
  }
}

type FieldValueBestResultContainerProps = {
  children: ReactNode;
};

export function FieldValueBestResultContainer({
  children,
}: FieldValueBestResultContainerProps) {
  return (
    <div className="grid grid-cols-2 w-full text-center min-h-[40px]">
      {children}
    </div>
  );
}

type FieldValueBestResultProps = {
  fieldName: string;
  bestResult:
    | Player['bestResultPDC']
    | Player['bestResultWDF']
    | Player['bestResultUKOpen'];
  comparison: RangedMatch;
  previousMatch?: PlayerToFindMatch;
  currentMatch?: PlayerToFindMatch;
};

export function FieldValueBestResult(props: FieldValueBestResultProps) {
  const { fieldName, bestResult, comparison, previousMatch, currentMatch } =
    props;

  function getRightResultColour() {
    if (comparison === undefined) {
      return 'bg-muted-foreground text-muted';
    } else if (comparison === 'match') {
      return 'bg-good-guess text-good-guess-foreground';
    } else {
      return 'bg-wrong-guess text-wrong-guess-foreground opacity-80 dark:opacity-100';
    }
  }

  return (
    <p
      className={cn(
        getRightResultColour(),
        'flex justify-end items-center rounded-l-md py-2 px-0.75 relative'
      )}
    >
      {bestResult}
      {comparison === 'higher' ? (
        <Arrow type="higher">
          {fieldName} should be <Bold>better</Bold>.
        </Arrow>
      ) : comparison === 'lower' ? (
        <Arrow type="lower">
          {fieldName} should be <Bold>worse</Bold>.
        </Arrow>
      ) : undefined}
      <GuessIndicator
        previousMatch={previousMatch}
        currentMatch={currentMatch}
      />
    </p>
  );
}

type FieldValueYearBestResultProps = {
  fieldName: string;
  yearBestResult: Player['yearOfBestResultPDC'] | Player['yearOfBestResultWDF'];
  comparison: RangedMatch;
  previousMatch?: PlayerToFindMatch;
  currentMatch?: PlayerToFindMatch;
};

export function FieldValueYearBestResult(props: FieldValueYearBestResultProps) {
  const { fieldName, yearBestResult, comparison, previousMatch, currentMatch } =
    props;

  function getRightYearColour() {
    if (comparison === undefined) {
      return 'bg-muted-foreground text-muted';
    } else if (comparison === 'match') {
      return 'bg-good-guess text-good-guess-foreground';
    } else {
      return 'bg-wrong-guess text-wrong-guess-foreground opacity-80 dark:opacity-100';
    }
  }

  return (
    <p
      className={cn(
        getRightYearColour(),
        'flex justify-start items-center rounded-r-md py-2 px-0.75 relative'
      )}
    >
      ({yearBestResult}
      {comparison === 'higher' ? (
        <Arrow type="higher">
          {fieldName} should be <Bold>later</Bold>.
        </Arrow>
      ) : comparison === 'lower' ? (
        <Arrow type="lower">
          {fieldName} should be <Bold>earlier</Bold>.
        </Arrow>
      ) : undefined}
      )
      <GuessIndicator
        previousMatch={previousMatch}
        currentMatch={currentMatch}
      />
    </p>
  );
}
