'use client';

import ExternalLink from '@/components/ExternalLink';
import { GamePageWrapper } from '@/components/GamePage';
import GamePageMiddle from '@/components/GamePageMiddle';
import { Field, FieldName } from '@/components/PlayerCardField';
import InlineSkeleton from '@/components/skeletons/InlineSkeleton';
import Tooltip from '@/components/Tooltip';
import TopBar, { TopBarButtons } from '@/components/TopBar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { ALL_MATCHES } from '@/lib/constants';
import { cn } from '@/lib/utils';
import {
  Cake,
  Calendar1,
  Globe,
  Hand,
  History,
  Map,
  ScrollText,
  Star,
  Target,
  TrendingUp,
  Trophy,
  VenusAndMars,
  Weight,
} from 'lucide-react';
import { usePathname } from 'next/navigation';
import { PiNumberCircleNine } from 'react-icons/pi';

type GamePageSkeletonProps = {
  isOfficialGame?: boolean;
};

export default function GamePageSkeleton({
  isOfficialGame = false,
}: GamePageSkeletonProps) {
  return (
    <GamePageWrapper>
      <TopBar>
        <TopBarButtons>
          <HintsButtonSkeleton />
          <GiveUpButtonSkeleton />
        </TopBarButtons>
        <GuessFormSkeleton />
      </TopBar>
      <ModeIndicatorSkeleton />
      {isOfficialGame && <PlayerToFindInfoSkeleton />}
      <GamePageMiddle>
        <ProgressBarSkeleton />
        <PlayerCardSkeleton type="gamePages" />
      </GamePageMiddle>
    </GamePageWrapper>
  );
}
function ModeIndicatorSkeleton() {
  return (
    <InlineSkeleton
      className="place-self-center sm:place-self-end text-lg p-2"
      fill="Official Mode 00"
    />
  );
}
function GiveUpButtonSkeleton() {
  return (
    <div className="sm:absolute sm:top-4 sm:right-0">
      <Skeleton className="w-16 h-7.5 sm:h-7 px-2 py-1" />
    </div>
  );
}
function HintsButtonSkeleton() {
  return (
    <div className="sm:absolute sm:top-4 sm:left-0">
      <Skeleton className="w-21 h-7.5 sm:h-7 px-2 py-1" />
    </div>
  );
}
function GuessFormSkeleton() {
  return (
    <div className="flex gap-2 sm:gap-3 sm:justify-center sm:w-full">
      <div className="hidden sm:block sm:w-24" />
      <Skeleton className="flex w-full gap-2 sm:gap-3 sm:w-[50%]" />
      <Skeleton className="h-15 right-0 cursor-pointer text-lg px-4 py-4 w-24" />
    </div>
  );
}
function ProgressBarSkeleton() {
  return (
    <div className="flex justify-center items-center gap-2">
      <InlineSkeleton className="p-0" fill={0} />
      <Progress
        className="w-[75vw] md:w-xl h-4 bg-muted-foreground animate-pulse"
        value={0}
      />
      <span>{ALL_MATCHES}</span>
    </div>
  );
}
function PlayerToFindInfoSkeleton() {
  const pathname = usePathname();

  return (
    <div
      className={cn(
        'flex p-2',
        pathname === '/' ? 'justify-between' : 'justify-end'
      )}
    >
      <div className="flex flex-col items-center p-2 rounded-md">
        <p>Guessed by</p>
        <Skeleton className="w-16 h-6" />
      </div>
      {pathname === '/' && (
        <div className="flex flex-col items-center p-2 rounded-md">
          <p>Next player in</p>
          <Skeleton className="w-16 h-6" />
        </div>
      )}
    </div>
  );
}

type PlayerCardSkeletonProps = {
  type: 'gamePages' | 'completedGame';
};

export function PlayerCardSkeleton({ type }: PlayerCardSkeletonProps) {
  return (
    <Card className="bg-transparent w-full">
      <CardHeader className="gap-0">
        {type === 'gamePages' ? (
          <CardTitle className="flex flex-col justify-center sm:justify-between items-center gap-3 sm:flex-row">
            <div className="flex items-center gap-3">
              <Skeleton className="p-2 min-h-[32px] flex gap-1 items-center min-w-16" />
              <Skeleton className="p-2 min-h-[32px] flex gap-1 items-center min-w-32" />
            </div>
            <Skeleton className="w-28 min-h-[32px] " />
          </CardTitle>
        ) : (
          <CardTitle className="flex justify-between items-center gap-2 truncate text-lg">
            <Skeleton className="w-40 sm:w-48 min-h-[28px]" />
            <Skeleton className="w-28 min-h-[36px] " />
          </CardTitle>
        )}
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          <div
            className={cn(
              'grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-4 lg:gap-8 items-center justify-center',
              type === 'gamePages' ? 'lg:gap-8' : 'lg:gap-6 xl:gap-8'
            )}
          >
            <Field>
              <FieldName>
                <VenusAndMars size={18} />
                Gender
              </FieldName>
              <Skeleton className="flex justify-center items-center p-2 rounded-md w-full min-h-[40px]" />
            </Field>
            <Field>
              <FieldName>
                <Cake size={18} />
                Age
              </FieldName>
              <Skeleton className="flex justify-center items-center p-2 rounded-md w-full min-h-[40px]" />
            </Field>
            <Field>
              <FieldName>
                <Map size={18} />
                Country
                {type === 'gamePages' && (
                  <Tooltip>
                    The country that a darts player represents. For example,
                    Jeffrey de Graaf represents Sweden, but he was born in the
                    Netherlands.
                  </Tooltip>
                )}
              </FieldName>
              <Skeleton className="flex justify-center items-center p-2 rounded-md w-full min-h-[40px]" />
            </Field>
            <Field>
              <FieldName>
                <Star size={18} />
                Status
                {type === 'gamePages' && (
                  <Tooltip>
                    A darts player can be:
                    <ul>
                      <br />
                      <li className="list-disc list-inside">
                        <span className="font-medium">active</span> (playing in
                        PDC/WDF/WSD/Modus or local/national events);
                      </li>
                      <li className="list-disc list-inside">
                        <span className="font-medium">retired</span> (no longer
                        taking part in events apart from exhibitions, the
                        example being Phil Taylor or Keith Deller); or
                      </li>
                      <li className="list-disc list-inside">
                        <span className="font-medium">deceased</span> (no longer
                        with us, but deserved to be included in the database).
                      </li>
                    </ul>
                  </Tooltip>
                )}
              </FieldName>
              <Skeleton className="flex justify-center items-center p-2 rounded-md w-full min-h-[40px]" />
            </Field>
            <Field className="col-span-2 col-start-1 sm:col-span-2 sm:col-start-2 md:col-span-1">
              <FieldName className="sm:text-sm md:text-xs lg:text-sm">
                <History size={18} />
                Playing Since
                {type === 'gamePages' && (
                  <Tooltip>
                    It is the year when a darts player started playing darts
                    rather than when they became good enough to compete in
                    larger events.
                  </Tooltip>
                )}
              </FieldName>
              <Skeleton className="flex justify-center items-center p-2 rounded-md w-full min-h-[40px]" />
            </Field>
          </div>
          <Separator />
          <div
            className={cn(
              'grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-4 lg:gap-8 items-center justify-center',
              type === 'gamePages' ? 'lg:gap-8' : 'lg:gap-6 xl:gap-8'
            )}
          >
            <Field>
              <FieldName>
                <TrendingUp size={18} />
                Elo Ranking
                {type === 'gamePages' && (
                  <Tooltip>
                    Put in simple terms, the Elo ranking of a darts player
                    developed by{' '}
                    <ExternalLink href="https://www.dartsrec.com/power-rankings">
                      DartsRec
                    </ExternalLink>{' '}
                    reflects their current skill level. It may differ
                    considerably from their PDC or WDF ranking.
                  </Tooltip>
                )}
              </FieldName>
              <Skeleton className="flex justify-center items-center p-2 rounded-md w-full min-h-[40px]" />
            </Field>
            <Field>
              <FieldName>
                <Hand size={18} />
                Laterality
              </FieldName>
              <Skeleton className="flex justify-center items-center p-2 rounded-md w-full min-h-[40px]" />
            </Field>
            <Field>
              <FieldName>
                <Target size={18} />
                Darts Brand
              </FieldName>
              <Skeleton className="flex justify-center items-center p-2 rounded-md w-full min-h-[40px]" />
            </Field>
            <Field>
              <FieldName>
                <Weight size={18} />
                Darts Weight
              </FieldName>
              <Skeleton className="flex justify-center items-center p-2 rounded-md w-full min-h-[40px]" />
            </Field>
            <Field className="col-span-2 col-start-1 sm:col-span-2 sm:col-start-2 md:col-span-1">
              <FieldName className="sm:text-sm md:text-xs lg:text-sm">
                <PiNumberCircleNine size={18} />
                PDC Nine-Darters
              </FieldName>
              <Skeleton className="flex justify-center items-center p-2 rounded-md w-full min-h-[40px]" />
            </Field>
          </div>
          <Separator />
          <div
            className={cn(
              'grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-4 lg:gap-8 items-center justify-center',
              type === 'gamePages' ? 'lg:gap-8' : 'lg:gap-6 xl:gap-8'
            )}
          >
            <Field className="col-span-2 md:col-span-1 sm:col-span-2 sm:col-start-2">
              <FieldName className="md:text-xs lg:text-sm">
                <Calendar1 size={18} />
                PDC Ranking
                {type === 'gamePages' && (
                  <Tooltip>
                    It refers to:
                    <ul>
                      <br />
                      <li className="list-disc list-inside">
                        <span className="font-medium">PDC World Rankings</span>{' '}
                        for male darts players, and;
                      </li>
                      <li className="list-disc list-inside">
                        <span className="font-medium">
                          PDC Women&apos;s Series Rankings
                        </span>{' '}
                        for female darts players.
                      </li>
                    </ul>
                  </Tooltip>
                )}
              </FieldName>
              <Skeleton className="flex justify-center items-center p-2 rounded-md w-full min-h-[40px]" />
            </Field>
            <Field className="col-span-2">
              <FieldName>
                <Trophy size={18} />
                Best UK Open Result
                {type === 'gamePages' && (
                  <Tooltip>
                    If a darts player achieved their best result more than once,
                    the year is the latest one.
                  </Tooltip>
                )}
              </FieldName>
              <Skeleton className="flex justify-center items-center p-2 rounded-md w-full min-h-[40px]" />
            </Field>
            <Field className="col-span-2">
              <FieldName className="sm:text-xs lg:text-sm">
                <Trophy size={18} />
                Best PDC World Championship Result
                {type === 'gamePages' && (
                  <Tooltip>
                    If a darts player achieved their best result more than once,
                    the year is the latest one.{' '}
                    <p>
                      Also, this field does{' '}
                      <span className="font-medium">not</span> include the best
                      PDC World Youth Championship result.
                    </p>
                  </Tooltip>
                )}
              </FieldName>
              <Skeleton className="flex justify-center items-center p-2 rounded-md w-full min-h-[40px]" />
            </Field>
          </div>
          <Separator />
          <div
            className={cn(
              'grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-4 lg:gap-8 items-center justify-center',
              type === 'gamePages' ? 'lg:gap-8' : 'lg:gap-6 xl:gap-8'
            )}
          >
            <Field className="col-span-2 sm:col-span-1">
              <FieldName className="md:text-xs lg:text-sm">
                <Calendar1 size={18} />
                WDF Ranking
                {type === 'gamePages' && (
                  <Tooltip>
                    It refers to:
                    <ul>
                      <br />
                      <li className="list-disc list-inside">
                        <span className="font-medium">
                          WDF Main Ranking Open
                        </span>{' '}
                        for male darts players, and;
                      </li>
                      <li className="list-disc list-inside">
                        <span className="font-medium">
                          WDF Main Ranking Women
                        </span>{' '}
                        for female darts players.
                      </li>
                      <br />
                    </ul>
                    Due to a large number of darts players in the WDF main
                    rankings, this field is updated only for{' '}
                    <span className="font-medium">
                      the first 500 darts players
                    </span>{' '}
                    in the ranking.
                  </Tooltip>
                )}
              </FieldName>
              <Skeleton className="flex justify-center items-center p-2 rounded-md w-full min-h-[40px]" />
            </Field>
            <Field>
              <FieldName>
                <ScrollText size={18} />
                Tour Card
              </FieldName>
              <Skeleton className="flex justify-center items-center p-2 rounded-md w-full min-h-[40px]" />
            </Field>
            <Field>
              <FieldName>
                <Globe size={18} />
                Played in WCoD
              </FieldName>
              <Skeleton className="flex justify-center items-center p-2 rounded-md w-full min-h-[40px]" />
            </Field>
            <Field className="col-span-2 sm:col-span-full md:col-span-2">
              <FieldName className="text-xs sm:text-sm md:text-[0.65rem] lg:text-sm">
                <Trophy size={18} />
                Best BDO/WDF World Championship Result
                {type === 'gamePages' && (
                  <Tooltip>
                    If a darts player achieved their best result more than once,
                    the year is the latest one.{' '}
                    <p>
                      Also, this field does{' '}
                      <span className="font-medium">not</span> include either
                      the best BDO/WDF World Youth Championship result or the
                      best News of the World Darts Championship result.
                    </p>
                  </Tooltip>
                )}
              </FieldName>
              <Skeleton className="flex justify-center items-center p-2 rounded-md w-full min-h-[40px]" />
            </Field>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
