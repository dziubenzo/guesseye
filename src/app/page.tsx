import { Field, FieldName, FieldValue } from '@/components/PlayerCardField';
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
  Hand,
  History,
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
        <CardTitle>{player.firstName + ' ' + player.lastName}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-4">
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
          <Field>
            <FieldName>
              <History size={18} />
              Playing Darts Since
            </FieldName>
            <FieldValue>{player.playingSince}</FieldValue>
          </Field>
          <Separator />
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
          <Field>
            <FieldName>
              <Hand size={18} />
              Laterality
            </FieldName>
            <FieldValue>{capitalise(player.laterality)}</FieldValue>
          </Field>
          <Field>
            <FieldName>
              <Building size={18} />
              Organisation
            </FieldName>
            <FieldValue>{player.organisation}</FieldValue>
          </Field>
          <Separator />
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
          <Field>
            <FieldName>
              <BadgePoundSterling size={18} />
              Prize Money
            </FieldName>
            <FieldValue>
              {player.prizeMoney ? formatPrizeMoney(player.prizeMoney) : ''}
            </FieldValue>
          </Field>
          <Field>
            <FieldName>
              <Trophy size={18} />
              Best PDC World Championship Result
            </FieldName>
            <FieldValue>
              {player.bestResultPDC + ` (${player.yearOfBestResultPDC})`}
            </FieldValue>
          </Field>
          <Separator />
          <Field>
            <FieldName>
              <Calendar1 size={18} />
              WDF Ranking
            </FieldName>
            <FieldValue>{player.rankingWDF}</FieldValue>
          </Field>
          <Field>
            <FieldName>
              <Trophy size={18} />
              Best BDO/WDF World Championship Result
            </FieldName>
            <FieldValue>
              {player.bestResultWDF + ` (${player.yearOfBestResultWDF})`}
            </FieldValue>
          </Field>
        </div>
      </CardContent>
      <CardFooter>
        <p>Card Footer</p>
      </CardFooter>
    </Card>
  );
}
