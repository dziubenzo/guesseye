'use client';

import ErrorMessage from '@/components/ErrorMessage';
import SuccessMessage from '@/components/SuccessMessage';
import { Button } from '@/components/ui/button';
import type { UpdateAction, UpdateRankingsType } from '@/lib/types';
import revalidateCache from '@/server/actions/revalidate-cache';
import updateAllRankings from '@/server/actions/update-all-rankings';
import updateRankings from '@/server/actions/update-rankings';
import updateTourCardHolders from '@/server/actions/update-tour-card-holders';
import { useState } from 'react';

export default function UpdateButtons() {
  const [updateRankingsResult, setUpdateRankingsResult] =
    useState<UpdateAction | null>(null);
  const [updateAllRankingsResult, setUpdateAllRankingsResult] =
    useState<UpdateAction | null>(null);
  const [updateTCHResult, setUpdateTCHResult] = useState<UpdateAction | null>(
    null
  );
  const [revalidateCacheResult, setRevalidateCacheResult] =
    useState<UpdateAction | null>(null);

  const [isDisabled, setIsDisabled] = useState(false);

  function clearMessages() {
    setUpdateRankingsResult(null);
    setUpdateAllRankingsResult(null);
    setUpdateTCHResult(null);
    setRevalidateCacheResult(null);
  }

  async function handleUpdateRankingsClick(type: UpdateRankingsType) {
    clearMessages();
    setIsDisabled(true);
    const result = await updateRankings(type);
    setUpdateRankingsResult(result);
    setIsDisabled(false);
  }

  async function handleUpdateAllRankingsClick() {
    clearMessages();
    setIsDisabled(true);
    const result = await updateAllRankings();
    setUpdateAllRankingsResult(result);
    setIsDisabled(false);
  }

  async function handleUpdateTCHClick() {
    clearMessages();
    setIsDisabled(true);
    const result = await updateTourCardHolders();
    setUpdateTCHResult(result);
    setIsDisabled(false);
  }

  async function handleRevalidateCacheClick() {
    clearMessages();
    setIsDisabled(true);
    const result = await revalidateCache();
    setRevalidateCacheResult(result);
    setIsDisabled(false);
  }

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-xl font-medium">Update Individual Rankings</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Button
          className="cursor-pointer"
          onClick={async () => await handleUpdateRankingsClick('menPDC')}
          disabled={isDisabled}
        >
          Update PDC Rankings - Men
        </Button>
        <Button
          className="cursor-pointer"
          onClick={async () => await handleUpdateRankingsClick('womenPDC')}
          disabled={isDisabled}
        >
          Update PDC Rankings - Women
        </Button>
        <Button
          className="cursor-pointer"
          onClick={async () => await handleUpdateRankingsClick('menWDF')}
          disabled={isDisabled}
        >
          Update WDF Rankings - Men
        </Button>
        <Button
          className="cursor-pointer"
          onClick={async () => await handleUpdateRankingsClick('womenWDF')}
          disabled={isDisabled}
        >
          Update WDF Rankings - Women
        </Button>
        <Button
          className="cursor-pointer col-span-1 sm:col-span-2 "
          onClick={async () => await handleUpdateRankingsClick('elo')}
          disabled={isDisabled}
        >
          Update Elo Rankings
        </Button>
      </div>
      {updateRankingsResult?.type === 'error' && (
        <ErrorMessage errorMessage={updateRankingsResult.message} />
      )}
      {updateRankingsResult?.type === 'success' && (
        <SuccessMessage successMessage={updateRankingsResult.message} />
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
      <h1 className="text-xl font-medium">Revalidate Cache</h1>
      <div className="flex flex-col gap-4">
        <Button
          className="cursor-pointer"
          onClick={handleRevalidateCacheClick}
          disabled={isDisabled}
        >
          Revalidate Cache
        </Button>
        {revalidateCacheResult?.type === 'success' && (
          <SuccessMessage successMessage={revalidateCacheResult.message} />
        )}
      </div>
    </div>
  );
}
