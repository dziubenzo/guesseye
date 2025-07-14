import {
  Field,
  FieldName,
  FieldValue,
  FieldValueBestResult,
} from '@/components/PlayerCardField';
import Tooltip from '@/components/Tooltip';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import type {
  ComparisonResults,
  Player,
  PlayerToFindMatches,
  PlayerToFindRangedMatch,
} from '@/lib/types';
import { capitalise, getAge, getDifficultyColour } from '@/lib/utils';
import { format } from 'date-fns';
import {
  Building,
  Cake,
  Calendar1,
  Gauge,
  Globe,
  Hand,
  History,
  Map,
  ScrollText,
  Star,
  Target,
  Trophy,
  VenusAndMars,
  Weight,
} from 'lucide-react';
import { PiNumberCircleNine } from 'react-icons/pi';

type PlayerCardProps =
  | {
      type: 'guess';
      player: Player;
      comparisonResults: ComparisonResults;
      guessNumber: number;
    }
  | {
      type: 'playerToFind';
      player: PlayerToFindMatches;
      difficulty: Player['difficulty'];
    };

export default function PlayerCard(props: PlayerCardProps) {
  const { type, player } = props;

  function formatPlayerToFindField<T>(
    field: PlayerToFindRangedMatch<T> | undefined,
    isAge?: boolean
  ) {
    if (field === undefined) {
      return '';
    }
    if (field.value === null) {
      return 'N/A';
    }

    if (isAge && field.value) {
      return getAge(field.value as string);
    } else {
      return field.value as T;
    }
  }

  if (type === 'playerToFind') {
    const { difficulty } = props;

    return (
      <Card className="bg-secondary w-full">
        <CardHeader>
          <CardTitle className="flex flex-col justify-center sm:justify-start items-center gap-4 sm:flex-row">
            <div className="flex items-center gap-3 w-[250px] sm:w-[300px]">
              <p
                className={`${player.firstName ? 'bg-good-guess text-good-guess-foreground' : 'bg-muted-foreground text-muted'} p-2 rounded-md text-center min-h-[32px] w-full`}
              >
                {player.firstName ? player.firstName : ''}
              </p>
              <p
                className={`${player.lastName ? 'bg-good-guess text-good-guess-foreground' : 'bg-muted-foreground text-muted'} p-2 rounded-md text-center min-h-[32px] w-full`}
              >
                {player.lastName ? player.lastName : ''}
              </p>
            </div>
            {difficulty && (
              <div
                className={`sm:ml-auto flex justify-center items-center gap-2 rounded-md bg-secondary-foreground py-1 px-2 ${getDifficultyColour(difficulty)} dark:text-secondary`}
              >
                <Gauge size={24} />
                <span>{difficulty.toUpperCase()}</span>
                <Tooltip>
                  How difficult the darts player is to find in the
                  developer&apos;s opinion.
                </Tooltip>
              </div>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-4 lg:gap-8 items-center justify-center text-center">
              <Field>
                <FieldName>
                  <VenusAndMars size={18} />
                  Gender
                </FieldName>
                <FieldValue type={'playerToFind'}>
                  {player.gender === undefined ? '' : capitalise(player.gender)}
                </FieldValue>
              </Field>
              <Field>
                <FieldName>
                  <Cake size={18} />
                  {player.status === 'deceased' ? 'Born In' : 'Age'}
                </FieldName>
                {player.status === 'deceased' ? (
                  <FieldValue type={'guess'} fieldName="Born In">
                    {player.dateOfBirth === undefined ||
                    player.dateOfBirth.type !== 'match'
                      ? ''
                      : player.dateOfBirth.value !== null
                        ? format(player.dateOfBirth.value, 'y')
                        : 'N/A'}
                  </FieldValue>
                ) : (
                  <FieldValue
                    type={'guess'}
                    comparisonResult={player.dateOfBirth?.type}
                    fieldName="Age"
                  >
                    {formatPlayerToFindField<Player['dateOfBirth']>(
                      player.dateOfBirth,
                      true
                    )}
                  </FieldValue>
                )}
              </Field>
              <Field>
                <FieldName>
                  <Map size={18} />
                  Country
                  <Tooltip>
                    The country that a darts player represents. For example,
                    Jeffrey de Graaf represents Sweden, but he was born in the
                    Netherlands.
                  </Tooltip>
                </FieldName>
                <FieldValue type={'playerToFind'}>
                  {player.country === undefined ? '' : player.country}
                </FieldValue>
              </Field>
              <Field>
                <FieldName>
                  <Star size={18} />
                  Status
                </FieldName>
                <FieldValue type={'playerToFind'}>
                  {player.status === undefined ? '' : capitalise(player.status)}
                </FieldValue>
              </Field>
              <Field className="col-span-2 col-start-1 sm:col-span-2 sm:col-start-2 md:col-span-1">
                <FieldName>
                  <History size={18} />
                  Playing Since
                </FieldName>
                <FieldValue
                  type={'guess'}
                  comparisonResult={player.playingSince?.type}
                  fieldName="Playing since"
                >
                  {formatPlayerToFindField<Player['playingSince']>(
                    player.playingSince
                  )}
                </FieldValue>
              </Field>
            </div>
            <Separator />
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-4 lg:gap-8 items-center justify-center text-center">
              <Field>
                <FieldName>
                  <Building size={18} />
                  Organisation
                </FieldName>
                <FieldValue type={'playerToFind'}>
                  {player.organisation === undefined ? '' : player.organisation}
                </FieldValue>
              </Field>
              <Field>
                <FieldName>
                  <Hand size={18} />
                  Laterality
                </FieldName>
                <FieldValue type={'playerToFind'}>
                  {player.laterality === undefined
                    ? ''
                    : capitalise(player.laterality)}
                </FieldValue>
              </Field>
              <Field>
                <FieldName>
                  <Target size={18} />
                  Darts Brand
                </FieldName>
                <FieldValue type={'playerToFind'}>
                  {player.dartsBrand === undefined
                    ? ''
                    : player.dartsBrand
                      ? player.dartsBrand
                      : 'N/A'}
                </FieldValue>
              </Field>
              <Field>
                <FieldName>
                  <Weight size={18} />
                  Darts Weight
                </FieldName>
                <FieldValue
                  type={'guess'}
                  comparisonResult={player.dartsWeight?.type}
                  fieldName="Darts weight"
                >
                  {formatPlayerToFindField<Player['dartsWeight']>(
                    player.dartsWeight
                  )}
                </FieldValue>
              </Field>
              <Field className="col-span-2 col-start-1 sm:col-span-2 sm:col-start-2 md:col-span-1">
                <FieldName className="sm:text-sm md:text-xs lg:text-sm">
                  <PiNumberCircleNine size={18} />
                  PDC Nine-Darters
                </FieldName>
                <FieldValue
                  type={'guess'}
                  comparisonResult={player.nineDartersPDC?.type}
                  fieldName="Nine-darters"
                >
                  {formatPlayerToFindField<Player['nineDartersPDC']>(
                    player.nineDartersPDC
                  )}
                </FieldValue>
              </Field>
            </div>
            <Separator />
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-4 lg:gap-8 items-center justify-center text-center">
              <Field className="col-span-2 md:col-span-1 sm:col-span-2 sm:col-start-2">
                <FieldName>
                  <Calendar1 size={18} />
                  {player.gender === 'female' ? 'WS Ranking' : 'PDC Ranking'}
                </FieldName>
                <FieldValue
                  type={'guess'}
                  comparisonResult={player.rankingPDC?.type}
                  fieldName={'PDC ranking'}
                >
                  {formatPlayerToFindField<Player['rankingPDC']>(
                    player.rankingPDC
                  )}
                </FieldValue>
              </Field>
              <Field className="col-span-2">
                <FieldName>
                  <Trophy size={18} />
                  Best UK Open Result
                  <Tooltip>
                    If a darts player achieved their best result more than once,
                    the year is the latest one.
                  </Tooltip>
                </FieldName>
                {player.bestResultUKOpen?.value &&
                player.yearOfBestResultUKOpen?.value ? (
                  <FieldValueBestResult
                    fieldNameBestResult={'Best UK Open result'}
                    fieldNameYearBestResult={'Year of best UK Open result'}
                    bestResult={player.bestResultUKOpen.value}
                    yearBestResult={player.yearOfBestResultUKOpen.value}
                    comparisonBestResult={player.bestResultUKOpen.type}
                    comparisonYearBestResult={
                      player.yearOfBestResultUKOpen.type
                    }
                  />
                ) : player.bestResultUKOpen?.value === null ? (
                  <FieldValue
                    type={'guess'}
                    fieldName={'Best UK Open result'}
                    comparisonResult={player.bestResultUKOpen?.type}
                  >
                    N/A
                  </FieldValue>
                ) : (
                  <FieldValue
                    type={'guess'}
                    fieldName={'Best UK Open result'}
                    comparisonResult={player.bestResultUKOpen?.type}
                  >
                    {' '}
                  </FieldValue>
                )}
              </Field>
              <Field className="col-span-2">
                <FieldName className="sm:text-xs lg:text-sm">
                  <Trophy size={18} />
                  Best PDC World Championship Result
                  <Tooltip>
                    If a darts player achieved their best result more than once,
                    the year is the latest one. Also, this field does{' '}
                    <span className="font-medium">not</span> include the best
                    PDC World Youth Championship result.
                  </Tooltip>
                </FieldName>
                {player.bestResultPDC?.value &&
                player.yearOfBestResultPDC?.value ? (
                  <FieldValueBestResult
                    fieldNameBestResult={'Best PDC World Championship result'}
                    fieldNameYearBestResult={
                      'Year of best PDC World Championship result'
                    }
                    bestResult={player.bestResultPDC.value}
                    yearBestResult={player.yearOfBestResultPDC.value}
                    comparisonBestResult={player.bestResultPDC.type}
                    comparisonYearBestResult={player.yearOfBestResultPDC.type}
                  />
                ) : player.bestResultPDC?.value === null ? (
                  <FieldValue
                    type={'guess'}
                    fieldName={'Best PDC World Championship result'}
                    comparisonResult={player.bestResultPDC?.type}
                  >
                    N/A
                  </FieldValue>
                ) : (
                  <FieldValue
                    type={'guess'}
                    fieldName={'Best PDC World Championship result'}
                    comparisonResult={player.bestResultPDC?.type}
                  >
                    {' '}
                  </FieldValue>
                )}
              </Field>
            </div>
            <Separator />
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 lg:gap-8 items-center justify-center text-center">
              <Field className="col-span-2 sm:col-span-1">
                <FieldName>
                  <Calendar1 size={18} />
                  WDF Ranking
                </FieldName>
                <FieldValue
                  type={'guess'}
                  comparisonResult={player.rankingWDF?.type}
                  fieldName="WDF ranking"
                >
                  {formatPlayerToFindField<Player['rankingWDF']>(
                    player.rankingWDF
                  )}
                </FieldValue>
              </Field>
              <Field>
                <FieldName>
                  <ScrollText size={18} />
                  Tour Card
                </FieldName>
                <FieldValue type={'playerToFind'}>
                  {player.tourCard === undefined
                    ? ''
                    : player.tourCard
                      ? 'Yes'
                      : 'No'}
                </FieldValue>
              </Field>
              <Field>
                <FieldName>
                  <Globe size={18} />
                  Played in WCoD
                </FieldName>
                <FieldValue type={'playerToFind'}>
                  {player.playedInWCOD === undefined
                    ? ''
                    : player.playedInWCOD
                      ? 'Yes'
                      : 'No'}
                </FieldValue>
              </Field>
              <Field className="col-span-2 sm:col-span-full md:col-span-2">
                <FieldName className="text-xs sm:text-sm md:text-[0.65rem] lg:text-sm">
                  <Trophy size={18} />
                  Best BDO/WDF World Championship Result
                  <Tooltip>
                    If a darts player achieved their best result more than once,
                    the year is the latest one. Also, this field does{' '}
                    <span className="font-medium">not</span> include the best
                    BDO/WDF World Youth Championship result.
                  </Tooltip>
                </FieldName>
                {player.bestResultWDF?.value &&
                player.yearOfBestResultWDF?.value ? (
                  <FieldValueBestResult
                    fieldNameBestResult={'Best PDC World Championship result'}
                    fieldNameYearBestResult={
                      'Year of best PDC World Championship result'
                    }
                    bestResult={player.bestResultWDF.value}
                    yearBestResult={player.yearOfBestResultWDF.value}
                    comparisonBestResult={player.bestResultWDF.type}
                    comparisonYearBestResult={player.yearOfBestResultWDF.type}
                  />
                ) : player.bestResultWDF?.value === null ? (
                  <FieldValue
                    type={'guess'}
                    fieldName={'Best PDC World Championship result'}
                    comparisonResult={player.bestResultWDF?.type}
                  >
                    N/A
                  </FieldValue>
                ) : (
                  <FieldValue
                    type={'guess'}
                    fieldName={'Best PDC World Championship result'}
                    comparisonResult={player.bestResultWDF?.type}
                  >
                    {' '}
                  </FieldValue>
                )}
              </Field>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (type === 'guess') {
    const { comparisonResults, guessNumber } = props;

    return (
      <Card className="bg-secondary w-full">
        <CardHeader>
          <CardTitle className="text-xl flex">
            <span>{player.firstName + ' ' + player.lastName}</span>
            <span className="ml-auto bg-secondary-foreground text-secondary px-3 rounded-md">
              #{guessNumber}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-4 lg:gap-6 xl:gap-8 items-center justify-center text-center">
              <Field>
                <FieldName>
                  <VenusAndMars size={18} />
                  Gender
                </FieldName>
                <FieldValue
                  type={'guess'}
                  fieldName={'Gender'}
                  comparisonResult={comparisonResults.gender}
                >
                  {capitalise(player.gender)}
                </FieldValue>
              </Field>
              <Field>
                <FieldName>
                  <Cake size={18} />
                  {player.status === 'deceased' ? 'Born In' : 'Age'}
                </FieldName>
                {player.status === 'deceased' ? (
                  <FieldValue type={'guess'} fieldName={'Born In'}>
                    {player.dateOfBirth !== null
                      ? format(player.dateOfBirth, 'y')
                      : 'N/A'}
                  </FieldValue>
                ) : (
                  <FieldValue
                    type={'guess'}
                    fieldName={'Age'}
                    comparisonResult={comparisonResults.dateOfBirth}
                  >
                    {player.dateOfBirth ? getAge(player.dateOfBirth) : 'N/A'}
                  </FieldValue>
                )}
              </Field>
              <Field>
                <FieldName>
                  <Map size={18} />
                  Country
                  <Tooltip>
                    The country that a darts player represents. For example,
                    Jeffrey de Graaf represents Sweden, but he was born in the
                    Netherlands.
                  </Tooltip>
                </FieldName>
                <FieldValue
                  type={'guess'}
                  fieldName={'Country'}
                  comparisonResult={comparisonResults.country}
                >
                  {player.country}
                </FieldValue>
              </Field>
              <Field>
                <FieldName>
                  <Star size={18} />
                  Status
                </FieldName>
                <FieldValue
                  type={'guess'}
                  fieldName={'Status'}
                  comparisonResult={comparisonResults.status}
                >
                  {capitalise(player.status)}
                </FieldValue>
              </Field>
              <Field className="col-span-2 col-start-1 sm:col-span-2 sm:col-start-2 md:col-span-1">
                <FieldName>
                  <History size={18} />
                  Playing Since
                </FieldName>
                <FieldValue
                  type={'guess'}
                  fieldName={'Playing since'}
                  comparisonResult={comparisonResults.playingSince}
                >
                  {player.playingSince ? player.playingSince : 'N/A'}
                </FieldValue>
              </Field>
            </div>
            <Separator />
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-4 lg:gap-6 xl:gap-8 items-center justify-center text-center">
              <Field>
                <FieldName>
                  <Building size={18} />
                  Organisation
                </FieldName>
                <FieldValue
                  type={'guess'}
                  fieldName={'Organisation'}
                  comparisonResult={comparisonResults.organisation}
                >
                  {player.organisation}
                </FieldValue>
              </Field>
              <Field>
                <FieldName>
                  <Hand size={18} />
                  Laterality
                </FieldName>
                <FieldValue
                  type={'guess'}
                  fieldName={'Laterality'}
                  comparisonResult={comparisonResults.laterality}
                >
                  {capitalise(player.laterality)}
                </FieldValue>
              </Field>
              <Field>
                <FieldName>
                  <Target size={18} />
                  Darts Brand
                </FieldName>
                <FieldValue
                  type={'guess'}
                  fieldName={'Darts brand'}
                  comparisonResult={comparisonResults.dartsBrand}
                >
                  {player.dartsBrand ? player.dartsBrand : 'N/A'}
                </FieldValue>
              </Field>
              <Field>
                <FieldName>
                  <Weight size={18} />
                  Darts Weight
                </FieldName>
                <FieldValue
                  type={'guess'}
                  fieldName={'Darts weight'}
                  comparisonResult={comparisonResults.dartsWeight}
                >
                  {player.dartsWeight ? player.dartsWeight : 'N/A'}
                </FieldValue>
              </Field>
              <Field className="col-span-2 col-start-1 sm:col-span-2 sm:col-start-2 md:col-span-1">
                <FieldName className="sm:text-sm md:text-xs lg:text-sm">
                  <PiNumberCircleNine size={18} />
                  PDC Nine-Darters
                </FieldName>
                <FieldValue
                  type={'guess'}
                  fieldName={'Nine-darters'}
                  comparisonResult={comparisonResults.nineDartersPDC}
                >
                  {player.nineDartersPDC}
                </FieldValue>
              </Field>
            </div>
            <Separator />
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-4 lg:gap-6 xl:gap-8 items-center justify-center text-center">
              <Field className="col-span-2 md:col-span-1 sm:col-span-2 sm:col-start-2">
                <FieldName>
                  <Calendar1 size={18} />
                  {player.gender === 'male' ? 'PDC Ranking' : 'WS Ranking'}
                </FieldName>
                <FieldValue
                  type={'guess'}
                  fieldName={'PDC ranking'}
                  comparisonResult={comparisonResults.rankingPDC}
                >
                  {player.rankingPDC ? player.rankingPDC : 'N/A'}
                </FieldValue>
              </Field>
              <Field className="col-span-2">
                <FieldName>
                  <Trophy size={18} />
                  Best UK Open Result
                  <Tooltip>
                    If a darts player achieved their best result more than once,
                    the year is the latest one.
                  </Tooltip>
                </FieldName>
                {player.bestResultUKOpen && player.yearOfBestResultUKOpen ? (
                  <FieldValueBestResult
                    fieldNameBestResult={'Best UK Open result'}
                    fieldNameYearBestResult={'Year of best UK Open result'}
                    bestResult={player.bestResultUKOpen}
                    yearBestResult={player.yearOfBestResultUKOpen}
                    comparisonBestResult={comparisonResults.bestResultUKOpen}
                    comparisonYearBestResult={
                      comparisonResults.yearOfBestResultUKOpen
                    }
                  />
                ) : (
                  <FieldValue
                    type={'guess'}
                    fieldName={'Best UK Open result'}
                    comparisonResult={comparisonResults.bestResultUKOpen}
                  >
                    N/A
                  </FieldValue>
                )}
              </Field>
              <Field className="col-span-2">
                <FieldName className="sm:text-xs lg:text-sm">
                  <Trophy size={18} />
                  Best PDC World Championship Result
                  <Tooltip>
                    If a darts player achieved their best result more than once,
                    the year is the latest one. Also, this field does{' '}
                    <span className="font-medium">not</span> include the best
                    PDC World Youth Championship result.
                  </Tooltip>
                </FieldName>
                {player.bestResultPDC && player.yearOfBestResultPDC ? (
                  <FieldValueBestResult
                    fieldNameBestResult={'Best PDC World Championship result'}
                    fieldNameYearBestResult={
                      'Year of best PDC World Championship result'
                    }
                    bestResult={player.bestResultPDC}
                    yearBestResult={player.yearOfBestResultPDC}
                    comparisonBestResult={comparisonResults.bestResultPDC}
                    comparisonYearBestResult={
                      comparisonResults.yearOfBestResultPDC
                    }
                  />
                ) : (
                  <FieldValue
                    type={'guess'}
                    fieldName={'Best PDC World Championship result'}
                    comparisonResult={comparisonResults.bestResultPDC}
                  >
                    N/A
                  </FieldValue>
                )}
              </Field>
            </div>
            <Separator />
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 lg:gap-6 xl:gap-8 items-center justify-center text-center">
              <Field className="col-span-2 sm:col-span-1">
                <FieldName>
                  <Calendar1 size={18} />
                  WDF Ranking
                </FieldName>
                <FieldValue
                  type={'guess'}
                  fieldName={'WDF ranking'}
                  comparisonResult={comparisonResults.rankingWDF}
                >
                  {player.rankingWDF ? player.rankingWDF : 'N/A'}
                </FieldValue>
              </Field>
              <Field>
                <FieldName>
                  <ScrollText size={18} />
                  Tour Card
                </FieldName>
                <FieldValue
                  type={'guess'}
                  fieldName={'Tour card'}
                  comparisonResult={comparisonResults.tourCard}
                >
                  {player.tourCard ? 'Yes' : 'No'}
                </FieldValue>
              </Field>
              <Field>
                <FieldName>
                  <Globe size={18} />
                  Played in WCoD
                </FieldName>
                <FieldValue
                  type={'guess'}
                  fieldName={'Played in WCoD'}
                  comparisonResult={comparisonResults.playedInWCOD}
                >
                  {player.playedInWCOD ? 'Yes' : 'No'}
                </FieldValue>
              </Field>
              <Field className="col-span-2 sm:col-span-full md:col-span-2">
                <FieldName className="text-xs sm:text-sm md:text-[0.65rem] lg:text-sm">
                  <Trophy size={18} />
                  Best BDO/WDF World Championship Result
                  <Tooltip>
                    If a darts player achieved their best result more than once,
                    the year is the latest one. Also, this field does{' '}
                    <span className="font-medium">not</span> include the best
                    BDO/WDF World Youth Championship result.
                  </Tooltip>
                </FieldName>
                {player.bestResultWDF && player.yearOfBestResultWDF ? (
                  <FieldValueBestResult
                    fieldNameBestResult={
                      'Best BDO/WDF World Championship result'
                    }
                    fieldNameYearBestResult={
                      'Year of best BDO/WDF World Championship result'
                    }
                    bestResult={player.bestResultWDF}
                    yearBestResult={player.yearOfBestResultWDF}
                    comparisonBestResult={comparisonResults.bestResultWDF}
                    comparisonYearBestResult={
                      comparisonResults.yearOfBestResultWDF
                    }
                  />
                ) : (
                  <FieldValue
                    type={'guess'}
                    fieldName={'Best BDO/WDF World Championship result'}
                    comparisonResult={comparisonResults.bestResultWDF}
                  >
                    N/A
                  </FieldValue>
                )}
              </Field>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }
}
