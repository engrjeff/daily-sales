import { ChevronDownIcon } from 'lucide-react';
import * as React from 'react';

import { cn } from '@/lib/utils';

export type NativeSelectProps = React.SelectHTMLAttributes<HTMLSelectElement>;

const NativeSelect = React.forwardRef<HTMLSelectElement, NativeSelectProps>(
  ({ className, ...props }, ref) => {
    return (
      <div className={cn('relative', className)}>
        <select
          ref={ref}
          className={cn(
            'border-input bg-muted/30 placeholder:text-muted-foreground focus:ring-ring focus-visible:border-ring aria-[invalid=true]:border-destructive aria-[invalid=true]:focus:ring-destructive flex h-9 w-full appearance-none items-center justify-between rounded-md border px-3 py-2 text-sm capitalize focus:outline-none focus:ring-1 disabled:cursor-not-allowed disabled:opacity-50',
            className
          )}
          {...props}
        />
        <ChevronDownIcon className="text-muted-foreground absolute right-2 top-1/2 size-4 -translate-y-1/2" />
      </div>
    );
  }
);
NativeSelect.displayName = 'NativeSelect';

export { NativeSelect };
