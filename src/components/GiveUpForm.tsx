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
import { useGameStore } from '@/lib/game-store';
import { giveUpSchema, type GiveUpSchemaType } from '@/lib/zod/give-up';
import { giveUp } from '@/server/actions/give-up';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useAction } from 'next-safe-action/hooks';
import { usePathname, useRouter } from 'next/navigation';
import { useState, type Dispatch, type SetStateAction } from 'react';
import { useForm } from 'react-hook-form';

type GiveUpFormProps = {
  setGiveUpError: Dispatch<SetStateAction<string>>;
  scheduleId?: string;
};

export default function GiveUpForm({
  setGiveUpError,
  scheduleId,
}: GiveUpFormProps) {
  const { resetState, mode } = useGameStore();

  const giveUpForm = useForm({
    resolver: zodResolver(giveUpSchema),
    defaultValues: {
      scheduleId,
      mode,
    },
  });
  const router = useRouter();
  const pathname = usePathname();

  const [open, setOpen] = useState(false);
  const [playerToFind, setPlayerToFind] = useState('');

  const { execute, isPending } = useAction(giveUp, {
    onSuccess({ data }) {
      if (data?.type === 'error') {
        setGiveUpError(data.error);
        return;
      }
      if (data?.type === 'success') {
        setPlayerToFind(data.playerToFind);
        return;
      }
    },
  });

  function onSubmit(values: GiveUpSchemaType) {
    setGiveUpError('');
    execute({ ...values, mode });
  }

  function handleButtonClick() {
    resetState();
    if (pathname.includes('official')) {
      router.push('/official');
    } else {
      setOpen(false);
      setPlayerToFind('');
      router.refresh();
    }
    return;
  }

  return (
    <>
      <div className="md:absolute md:top-4 md:right-0">
        <AlertDialog open={open} onOpenChange={setOpen}>
          <AlertDialogTrigger asChild>
            <Button
              variant="destructive"
              className={`cursor-pointer text-sm px-2 py-1 h-full`}
            >
              <span>Give Up</span>
            </Button>
          </AlertDialogTrigger>
          {playerToFind ? (
            <AlertDialogContent
              className="flex flex-col gap-0"
              onEscapeKeyDown={(event) => {
                event.preventDefault();
              }}
            >
              <AlertDialogHeader>
                <AlertDialogTitle>Game Given Up</AlertDialogTitle>
                <AlertDialogDescription className="flex flex-col gap-2">
                  <span className="block">The darts player to find was...</span>
                  <span className="block uppercase font-medium text-primary text-2xl">
                    {playerToFind}
                  </span>
                  <span className="block">Good luck next time!</span>
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel
                  className="cursor-pointer"
                  onClick={handleButtonClick}
                >
                  Close
                </AlertDialogCancel>
              </AlertDialogFooter>
            </AlertDialogContent>
          ) : (
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you 100% sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This cannot be undone. If you give up, you will learn the
                  current darts player, but you will be unable to try to guess
                  them again.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel
                  className="cursor-pointer"
                  onClick={() => setGiveUpError('')}
                  disabled={isPending}
                >
                  Cancel
                </AlertDialogCancel>
                <Form {...giveUpForm}>
                  <form onSubmit={giveUpForm.handleSubmit(onSubmit)}>
                    <Button
                      type="submit"
                      className="cursor-pointer min-w-21 w-full"
                      variant="destructive"
                      disabled={isPending}
                    >
                      {isPending ? (
                        <Loader2 className="animate-spin size-7 h-full" />
                      ) : (
                        'Give Up'
                      )}
                    </Button>
                  </form>
                </Form>
              </AlertDialogFooter>
            </AlertDialogContent>
          )}
        </AlertDialog>
      </div>
    </>
  );
}
