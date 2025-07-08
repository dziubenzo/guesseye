import { createAuthClient } from 'better-auth/react';

export const {
  signIn,
  signUp,
  signOut,
  forgetPassword,
  resetPassword,
  useSession,
  deleteUser,
} = createAuthClient();
