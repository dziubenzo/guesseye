import ResetPasswordForm from '@/components/ResetPasswordForm';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Reset Password' };

export default function ResetPassword() {
  return <ResetPasswordForm />;
}
