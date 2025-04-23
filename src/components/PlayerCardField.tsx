import { ReactNode } from 'react';

type FieldProps = { children: ReactNode; className?: string };

export function Field({ children, className }: FieldProps) {
  return (
    <div
      className={`flex flex-col gap-2 items-center justify-center ${className ? className : ''}`}
    >
      {children}
    </div>
  );
}

type FieldNameProps = FieldProps;

export function FieldName({ children, className }: FieldNameProps) {
  return (
    <p
      className={`flex gap-2 lg:gap-1 items-center text-sm min-h-[20px] ${className ? className : ''}`}
    >
      {children}
    </p>
  );
}

type FieldValueProps = Pick<FieldProps, 'children'>;

export function FieldValue({ children }: FieldValueProps) {
  return (
    <p className="bg-secondary p-2 rounded-md w-full text-center min-h-[40px]">
      {children}
    </p>
  );
}
