import { Button } from '@/components/ui/button';
import {
  DialogClose,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

type SignupSuccessProps = {
  email: string;
};

export default function SignupSuccess({ email }: SignupSuccessProps) {
  return (
    <div className="flex flex-col gap-3 justify-center items-center min-h-[400px]">
      <DialogHeader>
        <DialogTitle className="text-2xl">Account Created!</DialogTitle>
      </DialogHeader>
      <div className="py-4 text-center">
        <p>Your account has been created.</p>
        <p>A confirmation link has been sent to</p>
        <p className="text-xl text-center bg-secondary rounded-md p-4 my-5">
          {email}
        </p>
        <p>Click it to verify your account.</p>
        <p>You will be logged in automatically.</p>
      </div>
      <DialogFooter>
        <DialogClose asChild>
          <Button className="cursor-pointer text-lg p-6">Got it!</Button>
        </DialogClose>
      </DialogFooter>
    </div>
  );
}
