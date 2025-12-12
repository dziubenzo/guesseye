'use client';

import GiveUpForm from '@/components/GiveUpForm';
import Message from '@/components/Message';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useGameStore } from '@/lib/game-store';
import type { PlayerFullName, PlayerToFindMatches } from '@/lib/types';
import { evaluateMatches } from '@/lib/utils';
import { guessSchema, GuessSchemaType } from '@/lib/zod/check-guess';
import { checkGuess } from '@/server/actions/check-guess';
import { zodResolver } from '@hookform/resolvers/zod';
import Fuse from 'fuse.js';
import { Loader2 } from 'lucide-react';
import { useAction } from 'next-safe-action/hooks';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';

type PlayerFormProps = {
  names: PlayerFullName[];
  scheduleId?: string;
};

export default function PlayerForm({ names, scheduleId }: PlayerFormProps) {
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

  // Full names of previous guesses for duplicate guess checks
  const prevGuesses = useMemo(() => {
    const set = new Set<string>();

    for (const guess of guesses) {
      const fullName =
        guess.guessedPlayer.firstName + ' ' + guess.guessedPlayer.lastName;
      set.add(fullName);
    }

    return set;
  }, [guesses]);

  const fuzzyMatcher = new Fuse(names, {
    ignoreDiacritics: true,
    ignoreLocation: true,
    includeScore: true,
    threshold: 0.3,
    minMatchCharLength: 3,
    findAllMatches: true,
    keys: ['fullName'],
  });

  const { execute, isPending } = useAction(checkGuess, {
    onSuccess({ data }) {
      if (data?.type === 'error') {
        setError(data.error);
        return;
      }
      if (data?.type === 'success') {
        playerForm.resetField('guess');
        setNewMatches(data.success.newMatches);
        updateDifficulty(data.success.playerDifficulty);
        if (data.success.type === 'correctGuess') {
          updateGuesses(
            data.success.playerToFind,
            data.success.comparisonResults
          );
          finishGame(data.success.playerToFind);
        } else if (data.success.type === 'incorrectGuess') {
          updateGuesses(
            data.success.guessedPlayer,
            data.success.comparisonResults
          );
        }
        return;
      }
    },
  });

  function onSubmit(values: GuessSchemaType) {
    setError('');
    
    const matches = fuzzyMatcher.search(values.guess);
    const result = evaluateMatches(matches);

    if (result.type === 'error') {
      setError(result.message);
      return;
    }

    const guess = result.guess;
    const isDuplicateGuess = prevGuesses.has(guess);

    if (isDuplicateGuess) {
      setError('You have already guessed this player.');
      return;
    }

    execute({ ...values, currentMatches, mode, guess });
  }

  // Make sure state is reset on unmount
  useEffect(() => {
    return () => {
      resetState();
    };
  }, []);

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
    <div className="sticky bg-secondary top-0 p-2 sm:p-4 z-1 rounded-md">
      <Form {...playerForm}>
        <form onSubmit={playerForm.handleSubmit(onSubmit)}>
          <FormField
            control={playerForm.control}
            name="guess"
            render={({ field }) => (
              <FormItem className="gap-2 sm:gap-3">
                <div className="flex flex-col md:flex-row gap-2 sm:gap-3 md:justify-center">
                  <div className="hidden md:block md:h-full md:w-24"></div>
                  <div className="flex gap-2 sm:gap-3 md:w-[50%]">
                    <FormControl>
                      <Input
                        className="md:text-lg h-auto p-3 text-center placeholder:text-center"
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
                    className={`cursor-pointer text-lg px-4 py-4 md:h-full md:w-24`}
                  >
                    {isPending ? (
                      <Loader2 className="animate-spin size-7 h-full" />
                    ) : (
                      'Guess'
                    )}
                  </Button>
                </div>
                {error && (
                  <div className="flex justify-center">
                    <div className="w-full md:w-[50%]">
                      <Message type="error" message={error} />
                    </div>
                  </div>
                )}
              </FormItem>
            )}
          />
        </form>
      </Form>
    </div>
  );
}
