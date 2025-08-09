'use client';

import ErrorMessage from '@/components/ErrorMessage';
import GiveUpForm from '@/components/GiveUpForm';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useGameStore } from '@/lib/game-store';
import { PlayerToFindMatches } from '@/lib/types';
import { changeToGermanSpelling, checkForDuplicateGuess } from '@/lib/utils';
import { guessSchema, GuessSchemaType } from '@/lib/zod/check-guess';
import { checkGuess } from '@/server/actions/check-guess';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useAction } from 'next-safe-action/hooks';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

type PlayerFormProps = {
  scheduleId?: string;
};

export default function PlayerForm({ scheduleId }: PlayerFormProps) {
  const {
    finishGame,
    updateGuesses,
    updatePreviousMatches,
    updateCurrentMatches,
    resetState,
    updateDifficulty,
    guesses,
    gameOver,
    currentMatches,
    mode,
  } = useGameStore();

  const playerForm = useForm({
    resolver: zodResolver(guessSchema),
    defaultValues: {
      guess: '',
      scheduleId,
      currentMatches,
      mode,
    },
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
  });

  const [error, setError] = useState('');
  const [newMatches, setNewMatches] = useState<PlayerToFindMatches | null>(
    null
  );

  const { execute, isPending } = useAction(checkGuess, {
    onSuccess({ data }) {
      if (data?.type === 'error') {
        setError(data.error);
        return;
      }
      if (data?.type === 'success') {
        playerForm.resetField('guess');
        if (data.success.type === 'correctGuess') {
          updateGuesses(
            data.success.playerToFind,
            data.success.comparisonResults
          );
          setNewMatches(data.success.newMatches);
          updateDifficulty(data.success.playerDifficulty);
          finishGame(data.success.playerToFind);
          return;
        }
        if (data.success.type === 'incorrectGuess') {
          updateGuesses(
            data.success.guessedPlayer,
            data.success.comparisonResults
          );
          setNewMatches(data.success.newMatches);
          updateDifficulty(data.success.playerDifficulty);
          return;
        }
      }
    },
  });

  function onSubmit(values: GuessSchemaType) {
    setError('');
    const guess = changeToGermanSpelling(values.guess);
    const isDuplicateGuess = checkForDuplicateGuess(guess, guesses);
    if (isDuplicateGuess) {
      setError('You have already guessed this player.');
      return;
    }
    execute({ ...values, currentMatches, mode, guess });
  }

  // Make sure state is reset on scheduleId change
  useEffect(() => {
    resetState();
  }, [scheduleId]);

  // For some reason, the currentMatches object, when used inside the onSuccess callback, is not up-to-date despite it being a piece of state that is always up-to-date outside the callback
  // I originally planned to use the onSuccess callback to update both current and previous matches
  useEffect(() => {
    if (newMatches) {
      updatePreviousMatches(currentMatches);
      updateCurrentMatches(newMatches);
      setNewMatches(null);
    }
  }, [newMatches, currentMatches]);

  return (
    <div className="sm:flex sm:justify-center bg-background sticky top-0 p-4 z-1 rounded-md">
      <Form {...playerForm}>
        <form onSubmit={playerForm.handleSubmit(onSubmit)}>
          <FormField
            control={playerForm.control}
            name="guess"
            render={({ field }) => (
              <FormItem>
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 sm:justify-center">
                  <div className="flex gap-2">
                    <FormControl>
                      <Input
                        className="text-lg md:text-lg h-auto p-3 text-center placeholder:text-center"
                        disabled={isPending || gameOver}
                        onInput={() => setError('')}
                        autoFocus
                        {...field}
                      />
                    </FormControl>
                    <GiveUpForm
                      setGiveUpError={setError}
                      scheduleId={scheduleId}
                    />
                  </div>
                  <Button
                    type="submit"
                    variant="default"
                    disabled={isPending || gameOver}
                    className={`cursor-pointer text-lg px-4 py-4 sm:h-full sm:w-24`}
                  >
                    {isPending ? (
                      <Loader2 className="animate-spin size-7 h-full" />
                    ) : (
                      'Check'
                    )}
                  </Button>
                </div>
                {error && <ErrorMessage errorMessage={error} />}
              </FormItem>
            )}
          />
        </form>
      </Form>
    </div>
  );
}
