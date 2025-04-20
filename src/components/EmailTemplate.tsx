type EmailTemplateProps = {
  name: string;
  url: string;
};

export default function EmailTemplate({ name, url }: EmailTemplateProps) {
  return (
    <div>
      <h2>Welcome, {name}!</h2>
      <hr />
      <p>Thank you for creating an account on GuessEye.</p>
      <p>
        Click <a href={url}>here</a> to verify your account.
      </p>
      <p>The confirmation link is valid for 30 minutes.</p>
    </div>
  );
}
