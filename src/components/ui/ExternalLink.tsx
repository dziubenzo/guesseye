import type { ReactNode } from 'react';

type ExternalLinkProps = {
  children: ReactNode;
  href: string;
};

export default function ExternalLink({ children, href }: ExternalLinkProps) {
  return (
    <a href={href} className="font-medium underline underline-offset-2">
      {children}
    </a>
  );
}
