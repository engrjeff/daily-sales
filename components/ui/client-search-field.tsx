'use client';

import { Search, XIcon } from 'lucide-react';
import { ComponentProps } from 'react';

import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface Props extends ComponentProps<typeof Input> {
  containerClass?: string;
  onClearClick: () => void;
}

export function ClientSearchField({
  containerClass,
  className,
  onClearClick,
  ...props
}: Props) {
  return (
    <div className={cn('relative w-full', containerClass)}>
      <Input
        aria-label="Search"
        id="search"
        name="q"
        className={cn('peer h-10 pe-9 ps-9 lg:h-8', className)}
        {...props}
      />
      <div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50">
        <Search size={16} strokeWidth={2} />
      </div>

      {props.value ? (
        <button
          className="text-muted-foreground/80 ring-offset-background hover:text-foreground focus-visible:border-ring focus-visible:text-foreground focus-visible:ring-ring/30 absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-lg transition-shadow focus-visible:border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
          aria-label="clear search"
          type="button"
          onClick={onClearClick}
        >
          <XIcon
            size={16}
            strokeWidth={2}
            aria-hidden="true"
            className="hover:text-red-500"
          />
        </button>
      ) : null}
    </div>
  );
}
