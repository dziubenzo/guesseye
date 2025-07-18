'use client';

import ErrorMessage from '@/components/ErrorMessage';
import SuccessMessage from '@/components/SuccessMessage';
import { Button } from '@/components/ui/button';
import type {
  UpdateAction,
  UpdateRankingsOrganisation,
  UpdateRankingsType,
} from '@/lib/types';
import updateAllRankings from '@/server/actions/update-all-rankings';
import updateRankings from '@/server/actions/update-rankings';
import updateTourCardHolders from '@/server/actions/update-tour-card-holders';
import { useState } from 'react';

export default function UpdateButtons() {
  const [updateRankingResult, setUpdateRankingResult] =
    useState<UpdateAction | null>(null);
  const [updateAllRankingsResult, setUpdateAllRankingsResult] =
    useState<UpdateAction | null>(null);
  const [updateTCHResult, setUpdateTCHResult] = useState<UpdateAction | null>(
    null
  );
  const [isDisabled, setIsDisabled] = useState(false);

  function clearResults() {
    setUpdateRankingResult(null);
    setUpdateAllRankingsResult(null);
    setUpdateTCHResult(null);
  }

  async function handleUpdateRankingClick(
    organisation: UpdateRankingsOrganisation,
    type: UpdateRankingsType
  ) {
    clearResults();
    setIsDisabled(true);
    const result = await updateRankings(organisation, type);
    setUpdateRankingResult(result);
    setIsDisabled(false);
  }

  async function handleUpdateAllRankingsClick() {
    clearResults();
    setIsDisabled(true);
    const result = await updateAllRankings();
    setUpdateAllRankingsResult(result);
    setIsDisabled(false);
  }

  async function handleUpdateTCHClick() {
    clearResults();
    setIsDisabled(true);
    const result = await updateTourCardHolders();
    setUpdateTCHResult(result);
    setIsDisabled(false);
  }

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-xl font-medium">Update Individual Rankings</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Button
          className="cursor-pointer"
          onClick={async () => await handleUpdateRankingClick('PDC', 'men')}
          disabled={isDisabled}
        >
          Update PDC Ranking - Men
        </Button>
        <Button
          className="cursor-pointer"
          onClick={async () => await handleUpdateRankingClick('PDC', 'women')}
          disabled={isDisabled}
        >
          Update PDC Ranking - Women
        </Button>
        <Button
          className="cursor-pointer"
          onClick={async () => await handleUpdateRankingClick('WDF', 'men')}
          disabled={isDisabled}
        >
          Update WDF Ranking - Men
        </Button>
        <Button
          className="cursor-pointer"
          onClick={async () => await handleUpdateRankingClick('WDF', 'women')}
          disabled={isDisabled}
        >
          Update WDF Ranking - Women
        </Button>
      </div>
      {updateRankingResult?.type === 'error' && (
        <ErrorMessage errorMessage={updateRankingResult.message} />
      )}
      {updateRankingResult?.type === 'success' && (
        <SuccessMessage successMessage={updateRankingResult.message} />
      )}
      <h1 className="text-xl font-medium">Update All Rankings</h1>
      <div className="flex flex-col gap-4">
        <Button
          className="cursor-pointer"
          variant={'destructive'}
          onClick={handleUpdateAllRankingsClick}
          disabled={isDisabled}
        >
          Update All Rankings
        </Button>
        {updateAllRankingsResult?.type === 'error' && (
          <ErrorMessage errorMessage={updateAllRankingsResult.message} />
        )}
        {updateAllRankingsResult?.type === 'success' && (
          <SuccessMessage successMessage={updateAllRankingsResult.message} />
        )}
      </div>
      <h1 className="text-xl font-medium">Update Tour Card Holders</h1>
      <div className="flex flex-col gap-4">
        <Button
          className="cursor-pointer"
          onClick={handleUpdateTCHClick}
          disabled={isDisabled}
        >
          Update Tour Card Holders
        </Button>
        {updateTCHResult?.type === 'error' && (
          <ErrorMessage errorMessage={updateTCHResult.message} />
        )}
        {updateTCHResult?.type === 'success' && (
          <SuccessMessage successMessage={updateTCHResult.message} />
        )}
      </div>
    </div>
  );
}
