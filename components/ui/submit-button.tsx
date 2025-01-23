import { LoaderIcon } from 'lucide-react';
import * as React from 'react';

import { cn } from '@/lib/utils';

import { Button } from './button';

interface SubmitButtonProps extends React.ComponentProps<typeof Button> {
  loading?: boolean;
}

export function SubmitButton({
  children,
  className,
  loading,
  type = 'submit',
  ...props
}: SubmitButtonProps) {
  return (
    <Button
      disabled={loading || props.disabled}
      className={cn('relative', className)}
      type={type}
      {...props}
    >
      {loading ? (
        <span className="absolute inset-0 left-1/2 top-1/2 inline-flex w-full shrink-0 -translate-x-1/2 -translate-y-1/2 items-center justify-center text-center">
          <LoaderIcon className="size-4 animate-spin" />
        </span>
      ) : null}
      <span
        className={cn(
          'inline-flex shrink-0 items-center gap-2 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
          loading ? 'invisible' : ''
        )}
      >
        {children}
      </span>
    </Button>
  );
}
