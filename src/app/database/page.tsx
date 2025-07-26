import AgeChart from '@/components/charts/AgeChart';
import BestResultPDCChart from '@/components/charts/BestResultPDCChart';
import BestResultPDCYearChart from '@/components/charts/BestResultPDCYearChart';
import BestResultUKOpenChart from '@/components/charts/BestResultUKOpenChart';
import BestResultUKOpenYearChart from '@/components/charts/BestResultUKOpenYearChart';
import BestResultWDFChart from '@/components/charts/BestResultWDFChart';
import BestResultWDFYearChart from '@/components/charts/BestResultWDFYearChart';
import BirthDateChart from '@/components/charts/BirthDateChart';
import BirthDayChart from '@/components/charts/BirthDayChart';
import BirthMonthChart from '@/components/charts/BirthMonthChart';
import CountryChart from '@/components/charts/CountryChart';
import DartsBrandChart from '@/components/charts/DartsBrandChart';
import DartsWeightChart from '@/components/charts/DartsWeightChart';
import GeneralPieChart from '@/components/charts/GeneralPieChart';
import NineDartersChart from '@/components/charts/NineDartersChart';
import {
  DIFFICULTY_CHART_CONFIG,
  DIFFICULTY_COLOURS,
  GENDER_CHART_CONFIG,
  GENDER_COLOURS,
  LATERALITY_CHART_CONFIG,
  LATERALITY_COLOURS,
  STATUS_CHART_CONFIG,
  STATUS_COLOURS,
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
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

export const metadata: Metadata = { title: 'Database Stats' };

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
    laterality,
    dartsBrand,
    dartsWeight,
    nineDartersPDC,
    bestResultPDC,
    bestResultWDF,
    bestResultUKOpen,
    yearOfBestResultPDC,
    yearOfBestResultWDF,
    yearOfBestResultUKOpen,
    status,
    difficulty,
  } = stats;

  return (
    <div className="flex flex-col grow-1 justify-center">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Database Stats</CardTitle>
          <CardDescription>
            <p>
              Here you can find miscellaneous charts related to the database of
              darts players that powers this app.
            </p>
          </CardDescription>
        </CardHeader>
        <CardContent className="mt-4">
          <div className="flex flex-col gap-4 md:gap-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-0">
              <div className="flex flex-col justify-center items-center gap-4">
                <h2 className="font-medium text-center">
                  Darts Players By Gender
                </h2>
                <GeneralPieChart
                  data={gender}
                  config={GENDER_CHART_CONFIG}
                  colours={GENDER_COLOURS}
                />
              </div>
              <div className="flex flex-col justify-center items-center gap-4">
                <h2 className="font-medium text-center">
                  Darts Players By Laterality
                </h2>
                <GeneralPieChart
                  data={laterality}
                  config={LATERALITY_CHART_CONFIG}
                  colours={LATERALITY_COLOURS}
                />
              </div>
              <div className="flex flex-col justify-center items-center gap-4">
                <h2 className="font-medium text-center">
                  Darts Players By Status
                </h2>
                <GeneralPieChart
                  data={status}
                  config={STATUS_CHART_CONFIG}
                  colours={STATUS_COLOURS}
                />
              </div>
              <div className="flex flex-col justify-center items-center gap-4">
                <h2 className="font-medium text-center">
                  Darts Players By Difficulty
                </h2>
                <GeneralPieChart
                  data={difficulty}
                  config={DIFFICULTY_CHART_CONFIG}
                  colours={DIFFICULTY_COLOURS}
                />
              </div>
            </div>
            <div className="flex flex-col justify-center items-center gap-4">
              <h2 className="sm:text-2xl font-medium text-center">
                Active Darts Players By Age
              </h2>
              <AgeChart data={age} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-0">
              <div className="flex flex-col justify-center items-center gap-4">
                <h2 className="font-medium text-center">
                  Darts Players By Birth Month
                </h2>
                <BirthMonthChart data={birthMonth} />
              </div>
              <div className="flex flex-col justify-center items-center gap-4">
                <h2 className="font-medium text-center">
                  Darts Players By Birth Day
                </h2>
                <BirthDayChart data={birthDay} />
              </div>
            </div>
            <div className="flex flex-col justify-center items-center gap-4">
              <h2 className="sm:text-2xl font-medium text-center">
                Darts Players By Birth Date
              </h2>
              <BirthDateChart data={birthDate} />
            </div>
            <div className="flex flex-col justify-center items-center gap-4">
              <h2 className="sm:text-2xl font-medium text-center">
                Darts Players By Country
              </h2>
              <CountryChart data={country} />
            </div>
            <div className="flex flex-col justify-center items-center gap-4">
              <h2 className="sm:text-2xl font-medium text-center">
                Darts Players By Playing Since
              </h2>
              <PlayingSinceChart data={playingSince} />
            </div>
            <div className="flex flex-col justify-center items-center gap-4">
              <h2 className="sm:text-2xl font-medium text-center">
                Darts Players By Darts Brand
              </h2>
              <DartsBrandChart data={dartsBrand} />
            </div>
            <div className="flex flex-col justify-center items-center gap-4">
              <h2 className="sm:text-2xl font-medium text-center">
                Darts Players By Darts Weight
              </h2>
              <DartsWeightChart data={dartsWeight} />
            </div>
            <div className="flex flex-col justify-center items-center gap-4">
              <h2 className="sm:text-2xl font-medium text-center">
                Darts Players By PDC Nine-Darters
              </h2>
              <NineDartersChart data={nineDartersPDC} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-0">
              <div className="flex flex-col justify-center items-center gap-4">
                <h2 className="font-medium text-center">
                  Darts Players By Best PDC WC Result
                </h2>
                <BestResultPDCChart data={bestResultPDC} />
              </div>
              <div className="flex flex-col justify-center items-center gap-4">
                <h2 className="font-medium text-center">
                  Darts Players By Year of Best PDC WC Result
                </h2>
                <BestResultPDCYearChart data={yearOfBestResultPDC} />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-0">
              <div className="flex flex-col justify-center items-center gap-4">
                <h2 className="font-medium text-center">
                  Darts Players By Best BDO/WDF WC Result
                </h2>
                <BestResultWDFChart data={bestResultWDF} />
              </div>
              <div className="flex flex-col justify-center items-center gap-4">
                <h2 className="font-medium text-center">
                  Darts Players By Year of Best BDO/WDF WC Result
                </h2>
                <BestResultWDFYearChart data={yearOfBestResultWDF} />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-0">
              <div className="flex flex-col justify-center items-center gap-4">
                <h2 className="font-medium text-center">
                  Darts Players By Best UK Open Result
                </h2>
                <BestResultUKOpenChart data={bestResultUKOpen} />
              </div>
              <div className="flex flex-col justify-center items-center gap-4">
                <h2 className="font-medium text-center">
                  Darts Players By Year of Best UK Open Result
                </h2>
                <BestResultUKOpenYearChart data={yearOfBestResultUKOpen} />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
