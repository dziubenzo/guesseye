'use client';

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

type GuessFormProps = {
  names: PlayerFullName[];
  scheduleId?: string;
};

export default function GuessForm({ names, scheduleId }: GuessFormProps) {
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
  const [matchSuggestions, setMatchSuggestions] = useState<string[]>([]);

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
    setMatchSuggestions([]);

    const matches = fuzzyMatcher.search(values.guess);
    const result = evaluateMatches(matches, prevGuesses);

    if (result.type === 'error') {
      setError(result.message);
      setMatchSuggestions(result.matches);
      return;
    }

    const guess = result.guess;

    execute({ ...values, currentMatches, mode, guess });
  }

  function handleMatchSuggestionClick(matchSuggestion: string) {
    playerForm.setValue('guess', matchSuggestion);
    setError('');
    setMatchSuggestions([]);
    execute({ scheduleId, currentMatches, mode, guess: matchSuggestion });
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
    <Form {...playerForm}>
      <form onSubmit={playerForm.handleSubmit(onSubmit)} className="w-full">
        <FormField
          control={playerForm.control}
          name="guess"
          render={({ field }) => (
            <FormItem className="gap-0">
              <div className="flex gap-2 sm:gap-3 sm:justify-center sm:w-full">
                <div className="hidden sm:block sm:w-24" />
                <div className="flex w-full gap-2 sm:gap-3 sm:w-[50%]">
                  <FormControl>
                    <Input
                      className="sm:text-lg md:text-lg h-auto p-3 text-center placeholder:text-center"
                      disabled={isPending || gameOver}
                      onInput={() => {
                        setError('');
                        setMatchSuggestions([]);
                      }}
                      autoFocus
                      {...field}
                    />
                  </FormControl>
                </div>
                <Button
                  type="submit"
                  variant="default"
                  disabled={isPending || gameOver}
                  className="h-full right-0 cursor-pointer text-lg px-4 py-4 sm:w-24"
                >
                  {isPending ? (
                    <Loader2 className="animate-spin size-7 h-full" />
                  ) : (
                    'Guess'
                  )}
                </Button>
              </div>
              {error && (
                <div className="flex justify-center mt-2 sm:mt-3">
                  <div className="w-full sm:w-[50%]">
                    <Message
                      type={matchSuggestions.length === 0 ? 'error' : 'info'}
                    >
                      <p>{error}</p>
                      {matchSuggestions.length > 0 && (
                        <div className="grid grid-cols-2 gap-y-2 gap-x-4 sm:gap-x-2 grow-1">
                          {matchSuggestions.map((matchSuggestion) => (
                            <Button
                              variant={'ghost'}
                              className="cursor-pointer px-4 sm:px-0 ring-2 ring-accent/25 sm:ring-0"
                              key={matchSuggestion}
                              onClick={() =>
                                handleMatchSuggestionClick(matchSuggestion)
                              }
                            >
                              {matchSuggestion}
                            </Button>
                          ))}
                        </div>
                      )}
                    </Message>
                  </div>
                </div>
              )}
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
