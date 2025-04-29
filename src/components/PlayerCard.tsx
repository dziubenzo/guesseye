import {
  Field,
  FieldName,
  FieldValue,
  FieldValueBestResult,
} from '@/components/PlayerCardField';
import Tooltip from '@/components/Tooltip';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ComparisonResults, Player } from '@/lib/types';
import { capitalise, formatPrizeMoney, getAge } from '@/lib/utils';
import {
  BadgePoundSterling,
  Building,
  Cake,
  Calendar1,
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

type PlayerCardProps = {
  player: Player;
  comparisonResults: ComparisonResults;
};

export default function PlayerCard({
  player,
  comparisonResults,
}: PlayerCardProps) {
  return (
    <Card className="bg-secondary">
      <CardHeader>
        <CardTitle className="text-xl">
          {player.firstName + ' ' + player.lastName}
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
              <FieldValue
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
                fieldName={'Playing since'}
                comparisonResult={comparisonResults.playingSince}
              >
                {player.playingSince ? player.playingSince : 'N/A'}
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
              <FieldValue
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
                fieldName={'Nine-darters'}
                comparisonResult={comparisonResults.nineDartersPDC}
              >
                {player.nineDartersPDC}
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
                  fieldName={'Best PDC World Championship result'}
                  comparisonResult={comparisonResults.bestResultPDC}
                >
                  N/A
                </FieldValue>
              )}
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
                fieldName={'Played in WCoD'}
                comparisonResult={comparisonResults.playedInWCOD}
              >
                {player.playedInWCOD ? 'Yes' : 'No'}
              </FieldValue>
            </Field>
            <Field className="col-span-2 lg:col-span-1">
              <FieldName>
                <Layers2 size={18} />
                Played in BDO/WDF
                <Tooltip>
                  If the value says &quot;No&quot;, it means that a darts player
                  has <span className="font-bold">never</span> played in BDO/WDF
                  events.
                </Tooltip>
              </FieldName>
              <FieldValue
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
                  fieldNameBestResult={'Best BDO/WDF World Championship result'}
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
