import AgeChart from '@/components/charts/AgeChart';
import BirthDateChart from '@/components/charts/BirthDateChart';
import BirthDayChart from '@/components/charts/BirthDayChart';
import BirthMonthChart from '@/components/charts/BirthMonthChart';
import CountryChart from '@/components/charts/CountryChart';
import GeneralPieChart from '@/components/charts/GeneralPieChart';
import {
  DIFFICULTY_CHART_CONFIG,
  DIFFICULTY_COLOURS,
  GENDER_CHART_CONFIG,
  GENDER_COLOURS,
  LATERALITY_CHART_CONFIG,
  LATERALITY_COLOURS,
  ORGANISATION_CHART_CONFIG,
  ORGANISATION_COLOURS,
} from '@/components/charts/pie-chart-configs';
import PlayingSinceChart from '@/components/charts/PlayingSinceChart';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { getDatabaseStats } from '@/server/db/get-database-stats';
import { notFound } from 'next/navigation';

export default async function DatabaseStats() {
  const stats = await getDatabaseStats();

  if ('error' in stats) {
    return notFound();
  }

  const {
    gender,
    age,
    birthMonth,
    birthDate,
    birthDay,
    country,
    playingSince,
    organisation,
    laterality,
    dartsBrand,
    dartsWeight,
    nineDartersPDC,
    bestResultPDC,
    bestResultWDF,
    yearOfBestResultPDC,
    yearOfBestResultWDF,
    difficulty,
  } = stats;

  return (
    <div className="flex flex-col grow-1 justify-center">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Database Stats</CardTitle>
          <CardDescription>
            <p>Here you can find various database charts.</p>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 md:gap-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-0">
              <div className="flex flex-col justify-center items-center gap-4">
                <h2>Darts Players By Gender</h2>
                <GeneralPieChart
                  data={gender}
                  config={GENDER_CHART_CONFIG}
                  colours={GENDER_COLOURS}
                />
              </div>
              <div className="flex flex-col justify-center items-center gap-4">
                <h2>Darts Players By Laterality</h2>
                <GeneralPieChart
                  data={laterality}
                  config={LATERALITY_CHART_CONFIG}
                  colours={LATERALITY_COLOURS}
                />
              </div>
              <div className="flex flex-col justify-center items-center gap-4">
                <h2>Darts Players By Organisation</h2>
                <GeneralPieChart
                  data={organisation}
                  config={ORGANISATION_CHART_CONFIG}
                  colours={ORGANISATION_COLOURS}
                />
              </div>
              <div className="flex flex-col justify-center items-center gap-4">
                <h2>Darts Players By Difficulty</h2>
                <GeneralPieChart
                  data={difficulty}
                  config={DIFFICULTY_CHART_CONFIG}
                  colours={DIFFICULTY_COLOURS}
                />
              </div>
            </div>
            <div className="flex flex-col justify-center items-center gap-4">
              <h2 className="sm:text-2xl">Darts Players By Age</h2>
              <AgeChart data={age} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-0">
              <div className="flex flex-col justify-center items-center gap-4">
                <h2>Darts Players By Birth Month</h2>
                <BirthMonthChart data={birthMonth} />
              </div>
              <div className="flex flex-col justify-center items-center gap-4">
                <h2>Darts Players By Birth Day</h2>
                <BirthDayChart data={birthDay} />
              </div>
            </div>
            <div className="flex flex-col justify-center items-center gap-4">
              <h2 className="sm:text-2xl">Darts Players By Birth Date</h2>
              <BirthDateChart data={birthDate} />
            </div>
            <div className="flex flex-col justify-center items-center gap-4">
              <h2 className="sm:text-2xl">Darts Players By Country</h2>
              <CountryChart data={country} />
            </div>
            <div className="flex flex-col justify-center items-center gap-4">
              <h2 className="sm:text-2xl">Darts Players By Playing Since</h2>
              <PlayingSinceChart data={playingSince} />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
