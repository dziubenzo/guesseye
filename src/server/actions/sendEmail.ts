'use server';

import EmailTemplate from '@/components/EmailTemplate';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY!);

export default async function sendEmail(
  email: string,
  name: string,
  url: string
) {
  const { data, error } = await resend.emails.send({
    from: 'GuessEye <onboarding@resend.dev>',
    to: email,
    subject: 'GuessEye - Confirmation Link',
    react: EmailTemplate({ name, url }),
  });

  if (error) {
    return error;
  }

  return data;
}
