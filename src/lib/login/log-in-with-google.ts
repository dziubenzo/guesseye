import { signIn } from '@/lib/auth-client';
import { actionClient } from '@/lib/safe-action-client';

export const logInWithGoogle = actionClient.action(async () => {
  const { data, error } = await signIn.social({
    provider: 'google',
    callbackURL: '/',
    errorCallbackURL: '/',
    newUserCallbackURL: '/',
  });

  if (error) return { error: error.message };

  return { success: data };
});
