import { Field, FieldName, FieldValue } from '@/components/PlayerCardField';
import Tooltip from '@/components/Tooltip';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { capitalise, formatPrizeMoney, getAge } from '@/lib/utils';
import { getRatajski } from '@/server/db/get-ratajski';
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
  Power,
  PowerOff,
  ScrollText,
  Target,
  Trophy,
  VenusAndMars,
  Weight,
} from 'lucide-react';

export default async function Home() {
  const player = await getRatajski();

  if (!player) {
    return null;
  }

  return (
    <Card>
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
              <FieldValue>{capitalise(player.gender)}</FieldValue>
            </Field>
            <Field>
              <FieldName>
                <Cake size={18} />
                Age
              </FieldName>
              <FieldValue>{getAge(player.dateOfBirth)}</FieldValue>
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
              <FieldValue>{player.country}</FieldValue>
            </Field>
            <Field>
              <FieldName>
                {player.active ? <Power size={18} /> : <PowerOff size={18} />}
                Active
              </FieldName>
              <FieldValue>{player.active ? 'Yes' : 'No'}</FieldValue>
            </Field>
            <Field className="col-span-2 lg:col-span-1">
              <FieldName>
                <History size={18} />
                Playing Since
              </FieldName>
              <FieldValue>{player.playingSince}</FieldValue>
            </Field>
          </div>
          <Separator />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-8 items-center justify-center text-center">
            <Field>
              <FieldName>
                <Building size={18} />
                Organisation
              </FieldName>
              <FieldValue>{player.organisation}</FieldValue>
            </Field>
            <Field>
              <FieldName>
                <Hand size={18} />
                Laterality
              </FieldName>
              <FieldValue>{capitalise(player.laterality)}</FieldValue>
            </Field>
            <Field>
              <FieldName>
                <Target size={18} />
                Darts Brand
              </FieldName>
              <FieldValue>{player.dartsBrand}</FieldValue>
            </Field>
            <Field>
              <FieldName>
                <Weight size={18} />
                Darts Weight
              </FieldName>
              <FieldValue>{player.dartsWeight}</FieldValue>
            </Field>
          </div>
          <Separator />
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 lg:gap-8 items-center justify-center text-center">
            <Field>
              <FieldName>
                <Calendar1 size={18} />
                PDC Ranking
              </FieldName>
              <FieldValue>{player.rankingPDC}</FieldValue>
            </Field>
            <Field>
              <FieldName>
                <ScrollText size={18} />
                Tour Card
              </FieldName>
              <FieldValue>{player.tourCard ? 'Yes' : 'No'}</FieldValue>
            </Field>
            <Field className="col-span-2 lg:col-span-1">
              <FieldName>
                <BadgePoundSterling size={18} />
                Prize Money
              </FieldName>
              <FieldValue>
                {player.prizeMoney ? formatPrizeMoney(player.prizeMoney) : ''}
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
              <FieldValue>
                {player.bestResultPDC + ` (${player.yearOfBestResultPDC})`}
              </FieldValue>
            </Field>
          </div>
          <Separator />
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 lg:gap-8 items-center justify-center text-center">
            <Field>
              <FieldName>
                <Calendar1 size={18} />
                WDF Ranking
              </FieldName>
              <FieldValue>
                {player.rankingWDF ? player.rankingWDF : 'N/A'}
              </FieldValue>
            </Field>
            <Field>
              <FieldName>
                <Globe size={18} />
                Played in WCoD
              </FieldName>
              <FieldValue>{player.playedInWDF ? 'Yes' : 'No'}</FieldValue>
            </Field>
            <Field className="col-span-2 lg:col-span-1">
              <FieldName>
                <Layers2 size={18} />
                Played in BDO/WDF
                <Tooltip>
                  If the value says &quot;No&quot;, it means that a darts player
                  has <strong>never</strong> played in BDO/WDF events.
                </Tooltip>
              </FieldName>
              <FieldValue>{player.playedInWDF ? 'Yes' : 'No'}</FieldValue>
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
              <FieldValue>
                {player.bestResultWDF + ` (${player.yearOfBestResultWDF})`}
              </FieldValue>
            </Field>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <p>Last appearance: Yet to be seen!</p>
      </CardFooter>
    </Card>
  );
}
