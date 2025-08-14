'use client';

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
import { useSession, deleteUser, signOut } from '@/lib/auth-client';
import { useState } from 'react';

export default function DeleteAccount() {
  const { data } = useSession();

  const [open, setOpen] = useState(false);
  const [buttonClicked, setButtonClicked] = useState(false);

  async function handleDeleteAccountButtonClick() {
    setButtonClicked(true);
    await deleteUser({ callbackURL: '/' });
    await signOut();
  }

  return (
    <>
      <div className="mt-auto">
        <AlertDialog open={open} onOpenChange={setOpen}>
          <AlertDialogTrigger asChild>
            <Button
              variant="destructive"
              className={`cursor-pointer ml-auto w-full md:w-fit`}
            >
              <span>Delete Your Account</span>
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              {buttonClicked ? (
                <>
                  <AlertDialogTitle>Delete Account Link Sent</AlertDialogTitle>
                  <AlertDialogDescription>
                    A delete account email has been sent to{' '}
                    <span className="font-bold">{data?.user.email}</span>. Click
                    the link in the email to confirm the deletion of your
                    account.
                  </AlertDialogDescription>
                </>
              ) : (
                <>
                  <AlertDialogTitle>Are you 100% sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. If you delete your account,
                    all of{' '}
                    <span className="font-bold">your games and guesses</span>{' '}
                    will also be deleted.
                  </AlertDialogDescription>
                </>
              )}
            </AlertDialogHeader>
            {buttonClicked ? (
              <AlertDialogFooter>
                <AlertDialogCancel className="cursor-pointer">
                  OK
                </AlertDialogCancel>
              </AlertDialogFooter>
            ) : (
              <AlertDialogFooter>
                <AlertDialogCancel className="cursor-pointer">
                  Cancel
                </AlertDialogCancel>
                <Button
                  type="submit"
                  className="cursor-pointer"
                  variant="destructive"
                  onClick={handleDeleteAccountButtonClick}
                >
                  Delete Account
                </Button>
              </AlertDialogFooter>
            )}
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </>
  );
}
