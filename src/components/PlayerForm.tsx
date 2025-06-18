'use client';

import ErrorMessage from '@/components/ErrorMessage';
import GiveUpForm from '@/components/GiveUpForm';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useGameStore } from '@/lib/game-store';
import { checkForDuplicateGuess } from '@/lib/utils';
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
    updateMatches,
    guesses,
    gameOver,
    resetState,
    playerToFindMatches,
    gameMode,
  } = useGameStore();

  const playerForm = useForm({
    resolver: zodResolver(guessSchema),
    defaultValues: {
      guess: '',
      scheduleId,
      playerToFindMatches,
      gameMode,
    },
    mode: 'onSubmit',
  });

  const [error, setError] = useState('');

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
          updateMatches(data.success.playerToFindMatches);
          finishGame(data.success.playerToFind);
          return;
        }
        if (data.success.type === 'incorrectGuess') {
          updateGuesses(
            data.success.guessedPlayer,
            data.success.comparisonResults
          );
          updateMatches(data.success.playerToFindMatches);
          return;
        }
      }
    },
  });

  function onSubmit(values: GuessSchemaType) {
    setError('');
    const isDuplicateGuess = checkForDuplicateGuess(values.guess, guesses);
    if (isDuplicateGuess) {
      setError('You have already guessed this player.');
      return;
    }
    execute({ ...values, playerToFindMatches, gameMode });
  }

  useEffect(() => {
    if (!isPending || !gameOver) playerForm.setFocus('guess');
  }, [playerForm, isPending, gameOver]);

  // Make sure state is reset on scheduleId change
  useEffect(() => {
    resetState();
  }, [scheduleId]);

  return (
    <div className="md:flex md:justify-center bg-background sticky top-0 p-4 z-1 rounded-md">
      <Form {...playerForm}>
        <form onSubmit={playerForm.handleSubmit(onSubmit)}>
          <FormField
            control={playerForm.control}
            name="guess"
            render={({ field }) => (
              <FormItem>
                <div className="flex flex-col md:flex-row gap-3 md:gap-4">
                  <div className="flex gap-2">
                    <FormControl>
                      <Input
                        className="lg:text-lg h-auto p-3 text-center placeholder:text-center"
                        disabled={isPending || gameOver}
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
