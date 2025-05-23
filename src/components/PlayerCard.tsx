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
import {
  capitalise,
  formatPrizeMoney,
  getAge,
  getDifficultyColour,
} from '@/lib/utils';
import {
  BadgePoundSterling,
  Building,
  Cake,
  Calendar1,
  Gauge,
  Globe,
  Hand,
  History,
  Layers2,
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
    type: 'normal' | 'age' | 'prizeMoney' = 'normal'
  ) {
    if (field === undefined) {
      return '';
    }

    if (type === 'age' && field.value) {
      return getAge(field.value as string);
    } else if (type === 'prizeMoney' && field.value) {
      return formatPrizeMoney(field.value as number);
    } else if (type === 'normal' && field.value) {
      return field.value as T;
    } else {
      return 'N/A';
    }
  }

  if (type === 'playerToFind') {
    const { difficulty } = props;

    return (
      <Card className="bg-secondary w-full">
        <CardHeader>
          <CardTitle className="flex flex-col justify-center md:justify-start items-center gap-4 md:flex-row">
            <div className="flex items-center gap-3 w-[250px] md:w-[300px]">
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
                className={`md:ml-auto flex justify-center items-center gap-2 rounded-md bg-secondary-foreground py-1 px-2 ${getDifficultyColour(difficulty)} dark:text-secondary`}
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
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 lg:gap-8 items-center justify-center text-center">
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
                  Age
                </FieldName>
                <FieldValue
                  type={'guess'}
                  comparisonResult={player.dateOfBirth?.type}
                  fieldName="Age"
                >
                  {formatPlayerToFindField<Player['dateOfBirth']>(
                    player.dateOfBirth,
                    'age'
                  )}
                </FieldValue>
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
                  Active
                </FieldName>
                <FieldValue type={'playerToFind'}>
                  {player.active === undefined
                    ? ''
                    : player.active
                      ? 'Yes'
                      : 'No'}
                </FieldValue>
              </Field>
              <Field className="col-span-2 lg:col-span-1">
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
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 lg:gap-8 items-center justify-center text-center">
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
              <Field className="col-span-2 lg:col-span-1">
                <FieldName>
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
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 lg:gap-8 items-center justify-center text-center">
              <Field>
                <FieldName>
                  <Calendar1 size={18} />
                  PDC Ranking
                </FieldName>
                <FieldValue
                  type={'guess'}
                  comparisonResult={player.rankingPDC?.type}
                  fieldName="PDC ranking"
                >
                  {formatPlayerToFindField<Player['rankingPDC']>(
                    player.rankingPDC
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
              <Field className="col-span-2 lg:col-span-1">
                <FieldName>
                  <BadgePoundSterling size={18} />
                  Prize Money
                </FieldName>
                <FieldValue
                  type={'guess'}
                  comparisonResult={player.prizeMoney?.type}
                  fieldName="Prize money"
                >
                  {formatPlayerToFindField<Player['prizeMoney']>(
                    player.prizeMoney,
                    'prizeMoney'
                  )}
                </FieldValue>
              </Field>
              <Field className="col-span-2 lg:col-span-2">
                <FieldName>
                  <Trophy size={18} />
                  Best PDC World Championship Result
                  <Tooltip>
                    If a darts player achieved their best result more than once,
                    the year is the latest one.
                  </Tooltip>
                </FieldName>
                <FieldValueBestResult
                  type={'guess'}
                  fieldNameBestResult={'Best PDC World Championship result'}
                  fieldNameYearBestResult={
                    'Year of best PDC World Championship result'
                  }
                  bestResult={
                    formatPlayerToFindField<Player['bestResultPDC']>(
                      player.bestResultPDC
                    ) as 'N/A' | '' | Player['bestResultPDC']
                  }
                  yearBestResult={
                    formatPlayerToFindField<Player['yearOfBestResultPDC']>(
                      player.yearOfBestResultPDC
                    ) as 'N/A' | '' | Player['yearOfBestResultPDC']
                  }
                  comparisonBestResult={player.bestResultPDC?.type}
                  comparisonYearBestResult={player.yearOfBestResultPDC?.type}
                />
              </Field>
            </div>
            <Separator />
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 lg:gap-8 items-center justify-center text-center">
              <Field>
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
              <Field className="col-span-2 lg:col-span-1">
                <FieldName>
                  <Layers2 size={18} />
                  Played in BDO/WDF
                  <Tooltip>
                    If the value says &quot;No&quot;, it means that a darts
                    player has <span className="font-bold">never</span> played
                    in BDO/WDF events.
                  </Tooltip>
                </FieldName>
                <FieldValue type={'playerToFind'}>
                  {player.playedInWDF === undefined
                    ? ''
                    : player.playedInWDF
                      ? 'Yes'
                      : 'No'}
                </FieldValue>
              </Field>
              <Field className="col-span-2 lg:col-start-4">
                <FieldName className="text-xs lg:text-sm">
                  <Trophy size={18} />
                  Best BDO/WDF World Championship Result
                  <Tooltip>
                    If a darts player achieved their best result more than once,
                    the year is the latest one.
                  </Tooltip>
                </FieldName>
                <FieldValueBestResult
                  type={'guess'}
                  fieldNameBestResult={'Best BDO/WDF World Championship result'}
                  fieldNameYearBestResult={
                    'Year of best BDO/WDF World Championship result'
                  }
                  bestResult={
                    formatPlayerToFindField<Player['bestResultWDF']>(
                      player.bestResultWDF
                    ) as 'N/A' | '' | Player['bestResultWDF']
                  }
                  yearBestResult={
                    formatPlayerToFindField<Player['yearOfBestResultWDF']>(
                      player.yearOfBestResultWDF
                    ) as 'N/A' | '' | Player['yearOfBestResultWDF']
                  }
                  comparisonBestResult={player.bestResultWDF?.type}
                  comparisonYearBestResult={player.yearOfBestResultWDF?.type}
                />
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
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 lg:gap-6 xl:gap-8 items-center justify-center text-center">
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
                  Age
                </FieldName>
                <FieldValue
                  type={'guess'}
                  fieldName={'Age'}
                  comparisonResult={comparisonResults.dateOfBirth}
                >
                  {player.dateOfBirth ? getAge(player.dateOfBirth) : 'N/A'}
                </FieldValue>
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
                  Active
                </FieldName>
                <FieldValue
                  type={'guess'}
                  fieldName={'Active'}
                  comparisonResult={comparisonResults.active}
                >
                  {player.active ? 'Yes' : 'No'}
                </FieldValue>
              </Field>
              <Field className="col-span-2 lg:col-span-1">
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
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 lg:gap-6 xl:gap-8 items-center justify-center text-center">
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
              <Field className="col-span-2 lg:col-span-1">
                <FieldName>
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
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 lg:gap-6 xl:gap-8 items-center justify-center text-center">
              <Field>
                <FieldName>
                  <Calendar1 size={18} />
                  PDC Ranking
                </FieldName>
                <FieldValue
                  type={'guess'}
                  fieldName={'PDC ranking'}
                  comparisonResult={comparisonResults.rankingPDC}
                >
                  {player.rankingPDC ? player.rankingPDC : 'N/A'}
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
              <Field className="col-span-2 lg:col-span-1">
                <FieldName>
                  <BadgePoundSterling size={18} />
                  Prize Money
                </FieldName>
                <FieldValue
                  type={'guess'}
                  fieldName={'Prize money'}
                  comparisonResult={comparisonResults.prizeMoney}
                >
                  {player.prizeMoney
                    ? formatPrizeMoney(player.prizeMoney)
                    : 'N/A'}
                </FieldValue>
              </Field>
              <Field className="col-span-2 lg:col-span-2">
                <FieldName>
                  <Trophy size={18} />
                  Best PDC World Championship Result
                  <Tooltip>
                    If a darts player achieved their best result more than once,
                    the year is the latest one.
                  </Tooltip>
                </FieldName>
                {player.bestResultPDC && player.yearOfBestResultPDC ? (
                  <FieldValueBestResult
                    type={'guess'}
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
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 lg:gap-6 xl:gap-8 items-center justify-center text-center">
              <Field>
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
              <Field className="col-span-2 lg:col-span-1">
                <FieldName className="lg:text-xs xl:text-sm">
                  <Layers2 size={18} />
                  Played in BDO/WDF
                  <Tooltip>
                    If the value says &quot;No&quot;, it means that a darts
                    player has <span className="font-bold">never</span> played
                    in BDO/WDF events.
                  </Tooltip>
                </FieldName>
                <FieldValue
                  type={'guess'}
                  fieldName={'Played in BDO/WDF'}
                  comparisonResult={comparisonResults.playedInWDF}
                >
                  {player.playedInWDF ? 'Yes' : 'No'}
                </FieldValue>
              </Field>
              <Field className="col-span-2 lg:col-start-4">
                <FieldName className="text-xs lg:text-sm">
                  <Trophy size={18} />
                  Best BDO/WDF World Championship Result
                  <Tooltip>
                    If a darts player achieved their best result more than once,
                    the year is the latest one.
                  </Tooltip>
                </FieldName>
                {player.bestResultWDF && player.yearOfBestResultWDF ? (
                  <FieldValueBestResult
                    type={'guess'}
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
