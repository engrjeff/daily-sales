import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default:
          'border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80',
        secondary:
          'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80',
        destructive:
          'border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80',
        outline: 'text-foreground',
        filter:
          'bg-neutral-400/10 border-neutral-400/20 text-neutral-400 capitalize',
        PAID: 'bg-emerald-400/10 border-emerald-400/20 text-emerald-400 capitalize',
        PENDING:
          'bg-amber-400/10 border-amber-400/20 text-amber-400 capitalize',
        REFUNDED:
          'bg-neutral-400/10 border-neutral-400/20 text-neutral-400 capitalize',
        PARTIALLY_REFUNDED:
          'bg-neutral-400/10 border-neutral-400/20 text-neutral-400 capitalize',
        PREPARING:
          'bg-amber-400/10 border-amber-400/20 text-amber-400 capitalize',
        READY_FOR_PICKUP:
          'bg-neutral-400/10 border-neutral-400/20 text-neutral-400 capitalize',
        FULFILLED:
          'bg-emerald-400/10 border-emerald-400/20 text-emerald-400 capitalize',
        UNFULFILLED:
          'bg-neutral-400/10 border-neutral-400/20 text-neutral-400 capitalize',
        CANCELLED: 'bg-red-400/10 border-red-400/20 text-red-400 capitalize',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
