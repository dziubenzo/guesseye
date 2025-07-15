import { auth } from '@/lib/auth';
import { inferAdditionalFields } from 'better-auth/client/plugins';
import { createAuthClient } from 'better-auth/react';

export const {
  signIn,
  signUp,
  signOut,
  forgetPassword,
  resetPassword,
  useSession,
  deleteUser,
} = createAuthClient({ plugins: [inferAdditionalFields<typeof auth>()] });
