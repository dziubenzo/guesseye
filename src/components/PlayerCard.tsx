import ExternalLink from '@/components/ExternalLink';
import GuessIndicator from '@/components/GuessIndicator';
import {
  Field,
  FieldName,
  FieldValue,
  FieldValueBestResult,
  FieldValueBestResultContainer,
  FieldValueYearBestResult,
} from '@/components/PlayerCardField';
import Tooltip from '@/components/Tooltip';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { cardTopDuration, fieldsContainerVariant } from '@/lib/motion-variants';
import type {
  ComparisonResults,
  Player,
  PlayerToFindMatches,
  PlayerToFindRangedMatch,
} from '@/lib/types';
import { capitalise, getAge, getDifficultyColour } from '@/lib/utils';
import { format } from 'date-fns';
import {
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
  TrendingUp,
  Trophy,
  VenusAndMars,
  Weight,
} from 'lucide-react';
import { motion } from 'motion/react';
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
      difficulty: Player['difficulty'];
      previousMatches: PlayerToFindMatches;
      currentMatches: PlayerToFindMatches;
    };

export default function PlayerCard(props: PlayerCardProps) {
  const { type } = props;

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
    const { difficulty, previousMatches, currentMatches } = props;

    return (
      <Card className="bg-secondary w-full">
        <CardHeader>
          <CardTitle className="flex flex-col justify-center sm:justify-start items-center gap-4 sm:flex-row">
            <motion.div
              className="flex items-center gap-3 w-[250px] sm:w-[300px]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: cardTopDuration }}
            >
              <p
                className={`${currentMatches.firstName ? 'bg-good-guess text-good-guess-foreground' : 'bg-muted-foreground text-muted'} p-2 rounded-md text-center min-h-[32px] w-full relative`}
              >
                {currentMatches.firstName ? currentMatches.firstName : ''}
                <GuessIndicator
                  previousMatch={previousMatches.firstName}
                  currentMatch={currentMatches.firstName}
                />
              </p>
              <p
                className={`${currentMatches.lastName ? 'bg-good-guess text-good-guess-foreground' : 'bg-muted-foreground text-muted'} p-2 rounded-md text-center min-h-[32px] w-full relative`}
              >
                {currentMatches.lastName ? currentMatches.lastName : ''}
                <GuessIndicator
                  previousMatch={previousMatches.lastName}
                  currentMatch={currentMatches.lastName}
                />
              </p>
            </motion.div>
            {difficulty && (
              <motion.div
                className={`sm:ml-auto flex justify-center items-center gap-2 rounded-md bg-secondary-foreground py-1 px-2 ${getDifficultyColour(difficulty)} dark:text-secondary`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: cardTopDuration }}
              >
                <Gauge size={24} />
                <span>{difficulty.toUpperCase()}</span>
                <Tooltip>
                  How difficult the darts player is to find in the
                  developer&apos;s opinion.
                </Tooltip>
              </motion.div>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <motion.div
            className="flex flex-col gap-4"
            initial="hidden"
            animate="visible"
            variants={fieldsContainerVariant}
          >
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-4 lg:gap-8 items-center justify-center text-center">
              <Field>
                <FieldName>
                  <VenusAndMars size={18} />
                  Gender
                </FieldName>
                <FieldValue
                  type={'playerToFind'}
                  previousMatch={previousMatches.gender}
                  currentMatch={currentMatches.gender}
                >
                  {currentMatches.gender === undefined
                    ? ''
                    : capitalise(currentMatches.gender)}
                </FieldValue>
              </Field>
              <Field>
                <FieldName>
                  <Cake size={18} />
                  {currentMatches.status === 'deceased' ? 'Born In' : 'Age'}
                </FieldName>
                {currentMatches.status === 'deceased' ? (
                  <FieldValue
                    type={'guess'}
                    fieldName="Born In"
                    previousMatch={previousMatches.dateOfBirth}
                    currentMatch={currentMatches.dateOfBirth}
                  >
                    {currentMatches.dateOfBirth === undefined ||
                    currentMatches.dateOfBirth.type !== 'match'
                      ? ''
                      : currentMatches.dateOfBirth.value !== null
                        ? format(currentMatches.dateOfBirth.value, 'y')
                        : 'N/A'}
                  </FieldValue>
                ) : (
                  <FieldValue
                    type={'guess'}
                    comparisonResult={currentMatches.dateOfBirth?.type}
                    fieldName="Age"
                    previousMatch={previousMatches.dateOfBirth}
                    currentMatch={currentMatches.dateOfBirth}
                  >
                    {formatPlayerToFindField<Player['dateOfBirth']>(
                      currentMatches.dateOfBirth,
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
                <FieldValue
                  type={'playerToFind'}
                  previousMatch={previousMatches.country}
                  currentMatch={currentMatches.country}
                >
                  {currentMatches.country === undefined
                    ? ''
                    : currentMatches.country}
                </FieldValue>
              </Field>
              <Field>
                <FieldName>
                  <Star size={18} />
                  Status
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
                </FieldName>
                <FieldValue
                  type={'playerToFind'}
                  previousMatch={previousMatches.status}
                  currentMatch={currentMatches.status}
                >
                  {currentMatches.status === undefined
                    ? ''
                    : capitalise(currentMatches.status)}
                </FieldValue>
              </Field>
              <Field className="col-span-2 col-start-1 sm:col-span-2 sm:col-start-2 md:col-span-1">
                <FieldName className="sm:text-sm md:text-xs lg:text-sm">
                  <History size={18} />
                  {currentMatches.status === 'retired' ||
                  currentMatches.status == 'deceased'
                    ? 'Played Since'
                    : 'Playing Since'}
                  <Tooltip>
                    It is the year when a darts player started playing darts
                    rather than when they became good enough to compete in
                    larger events.
                  </Tooltip>
                </FieldName>
                <FieldValue
                  type={'guess'}
                  comparisonResult={currentMatches.playingSince?.type}
                  fieldName={
                    currentMatches.status === 'retired' ||
                    currentMatches.status == 'deceased'
                      ? 'Played since'
                      : 'Playing since'
                  }
                  previousMatch={previousMatches.playingSince}
                  currentMatch={currentMatches.playingSince}
                >
                  {formatPlayerToFindField<Player['playingSince']>(
                    currentMatches.playingSince
                  )}
                </FieldValue>
              </Field>
            </div>
            <Separator />
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-4 lg:gap-8 items-center justify-center text-center">
              <Field>
                <FieldName>
                  <TrendingUp size={18} />
                  Elo Ranking
                  <Tooltip>
                    Put in simple terms, the Elo ranking of a darts player
                    developed by{' '}
                    <ExternalLink href="https://www.dartsrec.com/power-rankings">
                      DartsRec
                    </ExternalLink>{' '}
                    reflects their current skill level. It may differ
                    considerably from their PDC or WDF ranking.
                  </Tooltip>
                </FieldName>
                <FieldValue
                  type={'guess'}
                  comparisonResult={currentMatches.rankingElo?.type}
                  fieldName="Elo ranking"
                  previousMatch={previousMatches.rankingElo}
                  currentMatch={currentMatches.rankingElo}
                >
                  {formatPlayerToFindField<Player['rankingElo']>(
                    currentMatches.rankingElo
                  )}
                </FieldValue>
              </Field>
              <Field>
                <FieldName>
                  <Hand size={18} />
                  Laterality
                </FieldName>
                <FieldValue
                  type={'playerToFind'}
                  previousMatch={previousMatches.laterality}
                  currentMatch={currentMatches.laterality}
                >
                  {currentMatches.laterality === undefined
                    ? ''
                    : capitalise(currentMatches.laterality)}
                </FieldValue>
              </Field>
              <Field>
                <FieldName>
                  <Target size={18} />
                  Darts Brand
                </FieldName>
                <FieldValue
                  type={'playerToFind'}
                  previousMatch={previousMatches.dartsBrand}
                  currentMatch={currentMatches.dartsBrand}
                >
                  {currentMatches.dartsBrand === undefined
                    ? ''
                    : currentMatches.dartsBrand
                      ? currentMatches.dartsBrand
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
                  comparisonResult={currentMatches.dartsWeight?.type}
                  fieldName="Darts weight"
                  previousMatch={previousMatches.dartsWeight}
                  currentMatch={currentMatches.dartsWeight}
                >
                  {formatPlayerToFindField<Player['dartsWeight']>(
                    currentMatches.dartsWeight
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
                  comparisonResult={currentMatches.nineDartersPDC?.type}
                  fieldName="Nine-darters"
                  previousMatch={previousMatches.nineDartersPDC}
                  currentMatch={currentMatches.nineDartersPDC}
                >
                  {formatPlayerToFindField<Player['nineDartersPDC']>(
                    currentMatches.nineDartersPDC
                  )}
                </FieldValue>
              </Field>
            </div>
            <Separator />
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-4 lg:gap-8 items-center justify-center text-center">
              <Field className="col-span-2 md:col-span-1 sm:col-span-2 sm:col-start-2">
                <FieldName className="md:text-xs lg:text-sm">
                  <Calendar1 size={18} />
                  {currentMatches.gender === 'female'
                    ? 'WS Ranking'
                    : 'PDC Ranking'}
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
                </FieldName>
                <FieldValue
                  type={'guess'}
                  comparisonResult={currentMatches.rankingPDC?.type}
                  fieldName={'PDC ranking'}
                  previousMatch={previousMatches.rankingPDC}
                  currentMatch={currentMatches.rankingPDC}
                >
                  {formatPlayerToFindField<Player['rankingPDC']>(
                    currentMatches.rankingPDC
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
                {currentMatches.bestResultUKOpen?.value &&
                currentMatches.yearOfBestResultUKOpen?.value ? (
                  <FieldValueBestResultContainer>
                    <FieldValueBestResult
                      fieldName={'Best UK Open result'}
                      bestResult={currentMatches.bestResultUKOpen.value}
                      comparison={currentMatches.bestResultUKOpen.type}
                      previousMatch={previousMatches.bestResultUKOpen}
                      currentMatch={currentMatches.bestResultUKOpen}
                    />
                    <FieldValueYearBestResult
                      fieldName={'Year of best UK Open result'}
                      yearBestResult={
                        currentMatches.yearOfBestResultUKOpen.value
                      }
                      comparison={currentMatches.yearOfBestResultUKOpen.type}
                      previousMatch={previousMatches.yearOfBestResultUKOpen}
                      currentMatch={currentMatches.yearOfBestResultUKOpen}
                    />
                  </FieldValueBestResultContainer>
                ) : currentMatches.bestResultUKOpen?.value === null ? (
                  <FieldValue
                    type={'guess'}
                    fieldName={'Best UK Open result'}
                    comparisonResult={currentMatches.bestResultUKOpen?.type}
                    previousMatch={previousMatches.bestResultUKOpen}
                    currentMatch={currentMatches.bestResultUKOpen}
                  >
                    Did Not Play
                  </FieldValue>
                ) : (
                  <FieldValue
                    type={'guess'}
                    fieldName={'Best UK Open result'}
                    comparisonResult={currentMatches.bestResultUKOpen?.type}
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
                    the year is the latest one.{' '}
                    <p>
                      Also, this field does{' '}
                      <span className="font-medium">not</span> include the best
                      PDC World Youth Championship result.
                    </p>
                  </Tooltip>
                </FieldName>
                {currentMatches.bestResultPDC?.value &&
                currentMatches.yearOfBestResultPDC?.value ? (
                  <FieldValueBestResultContainer>
                    <FieldValueBestResult
                      fieldName={'Best PDC World Championship result'}
                      bestResult={currentMatches.bestResultPDC.value}
                      comparison={currentMatches.bestResultPDC.type}
                      previousMatch={previousMatches.bestResultPDC}
                      currentMatch={currentMatches.bestResultPDC}
                    />
                    <FieldValueYearBestResult
                      fieldName={'Year of best PDC World Championship result'}
                      yearBestResult={currentMatches.yearOfBestResultPDC.value}
                      comparison={currentMatches.yearOfBestResultPDC.type}
                      previousMatch={previousMatches.yearOfBestResultPDC}
                      currentMatch={currentMatches.yearOfBestResultPDC}
                    />
                  </FieldValueBestResultContainer>
                ) : currentMatches.bestResultPDC?.value === null ? (
                  <FieldValue
                    type={'guess'}
                    fieldName={'Best PDC World Championship result'}
                    comparisonResult={currentMatches.bestResultPDC?.type}
                    previousMatch={previousMatches.bestResultPDC}
                    currentMatch={currentMatches.bestResultPDC}
                  >
                    Did Not Play
                  </FieldValue>
                ) : (
                  <FieldValue
                    type={'guess'}
                    fieldName={'Best PDC World Championship result'}
                    comparisonResult={currentMatches.bestResultPDC?.type}
                  >
                    {' '}
                  </FieldValue>
                )}
              </Field>
            </div>
            <Separator />
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 lg:gap-8 items-center justify-center text-center">
              <Field className="col-span-2 sm:col-span-1">
                <FieldName className="md:text-xs lg:text-sm">
                  <Calendar1 size={18} />
                  WDF Ranking
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
                </FieldName>
                <FieldValue
                  type={'guess'}
                  comparisonResult={currentMatches.rankingWDF?.type}
                  fieldName="WDF ranking"
                  previousMatch={previousMatches.rankingWDF}
                  currentMatch={currentMatches.rankingWDF}
                >
                  {formatPlayerToFindField<Player['rankingWDF']>(
                    currentMatches.rankingWDF
                  )}
                </FieldValue>
              </Field>
              <Field>
                <FieldName>
                  <ScrollText size={18} />
                  Tour Card
                </FieldName>
                <FieldValue
                  type={'playerToFind'}
                  previousMatch={previousMatches.tourCard}
                  currentMatch={currentMatches.tourCard}
                >
                  {currentMatches.tourCard === undefined
                    ? ''
                    : currentMatches.tourCard
                      ? 'Yes'
                      : 'No'}
                </FieldValue>
              </Field>
              <Field>
                <FieldName>
                  <Globe size={18} />
                  Played in WCoD
                </FieldName>
                <FieldValue
                  type={'playerToFind'}
                  previousMatch={previousMatches.playedInWCOD}
                  currentMatch={currentMatches.playedInWCOD}
                >
                  {currentMatches.playedInWCOD === undefined
                    ? ''
                    : currentMatches.playedInWCOD
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
                    the year is the latest one.{' '}
                    <p>
                      Also, this field does{' '}
                      <span className="font-medium">not</span> include either
                      the best BDO/WDF World Youth Championship result or the
                      best News of the World Darts Championship result.
                    </p>
                  </Tooltip>
                </FieldName>
                {currentMatches.bestResultWDF?.value &&
                currentMatches.yearOfBestResultWDF?.value ? (
                  <FieldValueBestResultContainer>
                    <FieldValueBestResult
                      fieldName={'Best BDO/WDF World Championship result'}
                      bestResult={currentMatches.bestResultWDF.value}
                      comparison={currentMatches.bestResultWDF.type}
                      previousMatch={previousMatches.bestResultWDF}
                      currentMatch={currentMatches.bestResultWDF}
                    />
                    <FieldValueYearBestResult
                      fieldName={
                        'Year of best BDO/WDF World Championship result'
                      }
                      yearBestResult={currentMatches.yearOfBestResultWDF.value}
                      comparison={currentMatches.yearOfBestResultWDF.type}
                      previousMatch={previousMatches.yearOfBestResultWDF}
                      currentMatch={currentMatches.yearOfBestResultWDF}
                    />
                  </FieldValueBestResultContainer>
                ) : currentMatches.bestResultWDF?.value === null ? (
                  <FieldValue
                    type={'guess'}
                    fieldName={'Best PDC World Championship result'}
                    comparisonResult={currentMatches.bestResultWDF?.type}
                    previousMatch={previousMatches.bestResultWDF}
                    currentMatch={currentMatches.bestResultWDF}
                  >
                    Did Not Play
                  </FieldValue>
                ) : (
                  <FieldValue
                    type={'guess'}
                    fieldName={'Best PDC World Championship result'}
                    comparisonResult={currentMatches.bestResultWDF?.type}
                  >
                    {' '}
                  </FieldValue>
                )}
              </Field>
            </div>
          </motion.div>
        </CardContent>
      </Card>
    );
  }

  if (type === 'guess') {
    const { player, comparisonResults, guessNumber } = props;

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
                  {player.status === 'retired' || player.status == 'deceased'
                    ? 'Played Since'
                    : 'Playing Since'}
                </FieldName>
                <FieldValue
                  type={'guess'}
                  fieldName={
                    player.status === 'retired' || player.status == 'deceased'
                      ? 'Played Since'
                      : 'Playing Since'
                  }
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
                  <TrendingUp size={18} />
                  Elo Ranking
                </FieldName>
                <FieldValue
                  type={'guess'}
                  fieldName={'Elo ranking'}
                  comparisonResult={comparisonResults.rankingElo}
                >
                  {player.rankingElo ? player.rankingElo : 'N/A'}
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
                </FieldName>
                {player.bestResultUKOpen && player.yearOfBestResultUKOpen ? (
                  <FieldValueBestResultContainer>
                    <FieldValueBestResult
                      fieldName={'Best UK Open result'}
                      bestResult={player.bestResultUKOpen}
                      comparison={comparisonResults.bestResultUKOpen}
                    />
                    <FieldValueYearBestResult
                      fieldName={'Year of best UK Open result'}
                      yearBestResult={player.yearOfBestResultUKOpen}
                      comparison={comparisonResults.yearOfBestResultUKOpen}
                    />
                  </FieldValueBestResultContainer>
                ) : (
                  <FieldValue
                    type={'guess'}
                    fieldName={'Best UK Open result'}
                    comparisonResult={comparisonResults.bestResultUKOpen}
                  >
                    Did Not Play
                  </FieldValue>
                )}
              </Field>
              <Field className="col-span-2">
                <FieldName className="sm:text-xs lg:text-sm">
                  <Trophy size={18} />
                  Best PDC World Championship Result
                </FieldName>
                {player.bestResultPDC && player.yearOfBestResultPDC ? (
                  <FieldValueBestResultContainer>
                    <FieldValueBestResult
                      fieldName={'Best PDC World Championship result'}
                      bestResult={player.bestResultPDC}
                      comparison={comparisonResults.bestResultPDC}
                    />
                    <FieldValueYearBestResult
                      fieldName={'Year of best PDC World Championship result'}
                      yearBestResult={player.yearOfBestResultPDC}
                      comparison={comparisonResults.yearOfBestResultPDC}
                    />
                  </FieldValueBestResultContainer>
                ) : (
                  <FieldValue
                    type={'guess'}
                    fieldName={'Best PDC World Championship result'}
                    comparisonResult={comparisonResults.bestResultPDC}
                  >
                    Did Not Play
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
                </FieldName>
                {player.bestResultWDF && player.yearOfBestResultWDF ? (
                  <FieldValueBestResultContainer>
                    <FieldValueBestResult
                      fieldName={'Best BDO/WDF World Championship result'}
                      bestResult={player.bestResultWDF}
                      comparison={comparisonResults.bestResultWDF}
                    />
                    <FieldValueYearBestResult
                      fieldName={
                        'Year of best BDO/WDF World Championship result'
                      }
                      yearBestResult={player.yearOfBestResultWDF}
                      comparison={comparisonResults.yearOfBestResultWDF}
                    />
                  </FieldValueBestResultContainer>
                ) : (
                  <FieldValue
                    type={'guess'}
                    fieldName={'Best BDO/WDF World Championship result'}
                    comparisonResult={comparisonResults.bestResultWDF}
                  >
                    Did Not Play
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
