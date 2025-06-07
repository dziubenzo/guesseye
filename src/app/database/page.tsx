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
    birthYear,
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

  console.log(difficulty);

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
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="flex flex-col justify-center items-center grow-1">
              <h2>Darts Players By Gender</h2>
              <GeneralPieChart
                data={gender}
                config={GENDER_CHART_CONFIG}
                colours={GENDER_COLOURS}
              />
            </div>
            <div className="flex flex-col justify-center items-center grow-1">
              <h2>Darts Players By Laterality</h2>
              <GeneralPieChart
                data={laterality}
                config={LATERALITY_CHART_CONFIG}
                colours={LATERALITY_COLOURS}
              />
            </div>
            <div className="flex flex-col justify-center items-center grow-1">
              <h2>Darts Players By Organisation</h2>
              <GeneralPieChart
                data={organisation}
                config={ORGANISATION_CHART_CONFIG}
                colours={ORGANISATION_COLOURS}
              />
            </div>
            <div className="flex flex-col justify-center items-center grow-1">
              <h2>Darts Players By Difficulty</h2>
              <GeneralPieChart
                data={difficulty}
                config={DIFFICULTY_CHART_CONFIG}
                colours={DIFFICULTY_COLOURS}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
