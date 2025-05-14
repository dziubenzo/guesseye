import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { giveUpSchema } from '@/lib/zod/give-up';
import { giveUp } from '@/server/actions/give-up';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAction } from 'next-safe-action/hooks';
import { type Dispatch, type SetStateAction } from 'react';
import { useForm } from 'react-hook-form';

type GiveUpFormProps = {
  setGiveUpError: Dispatch<SetStateAction<string>>;
};

export default function GiveUpForm({ setGiveUpError }: GiveUpFormProps) {
  const giveUpForm = useForm({
    resolver: zodResolver(giveUpSchema),
    defaultValues: {
      hasGivenUp: false,
    },
  });

  const { execute, isPending } = useAction(giveUp, {
    onSuccess({ data }) {},
  });

  function onSubmit() {
    setGiveUpError('');
    execute({ hasGivenUp: true });
  }
  return (
    <>
      <div className="md:absolute md:top-2 md:right-2">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="destructive"
              className={`cursor-pointer text-sm px-2 py-1 h-full`}
            >
              <span>Give Up</span>
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you 100% sure?</AlertDialogTitle>
              <AlertDialogDescription className="text-balance">
                This cannot be undone. You will learn the current darts player
                to find, but you will have to wait for the next scheduled darts
                player to play again.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel
                className="cursor-pointer"
                onClick={() => setGiveUpError('')}
              >
                Cancel
              </AlertDialogCancel>
              <Form {...giveUpForm}>
                <form onSubmit={giveUpForm.handleSubmit(onSubmit)}>
                  <Button
                    type="submit"
                    className="cursor-pointer w-full"
                    variant="destructive"
                    disabled={isPending}
                  >
                    Give Up
                  </Button>
                </form>
              </Form>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </>
  );
}
