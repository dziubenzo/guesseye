type ResetPasswordEmail = {
  name: string;
  url: string;
};

export default function ResetPasswordEmail({ name, url }: ResetPasswordEmail) {
  return (
    <div>
      <h2>Hi, {name}!</h2>
      <p>
        Click <a href={url}>here</a> to reset your password.
      </p>
      <p>The reset password link is valid for 30 minutes.</p>
      <p>If you did not request this email, please ignore it.</p>
    </div>
  );
}
