import * as React from 'react';

import { cn } from '@/lib/utils';

import { Input } from './input';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  currency?: string;
  noDecimal?: boolean;
}

const NumberInput = React.forwardRef<HTMLInputElement, InputProps>(
  (
    { className, type = 'number', currency, noDecimal, onChange, ...props },
    ref
  ) => {
    function handleOnChange(e: React.ChangeEvent<HTMLInputElement>) {
      if (!onChange) return;

      if (noDecimal) {
        if (e.currentTarget.value.includes('.')) return;
      }

      onChange(e);
    }

    if (currency)
      return (
        <div className="relative rounded-md">
          <div className="absolute left-0 top-0 flex h-full min-w-9 items-center justify-center rounded-l p-1 text-center">
            <span className="text-muted-foreground text-sm">{currency}</span>
          </div>
          <Input
            className={cn('pl-9', className)}
            ref={ref}
            type={type}
            inputMode="numeric"
            onWheel={(e) => {
              e.currentTarget?.blur();
            }}
            {...props}
            onChange={handleOnChange}
          />
        </div>
      );

    return (
      <Input
        className={className}
        ref={ref}
        type="number"
        inputMode="numeric"
        onWheel={(e) => {
          e.currentTarget?.blur();
        }}
        {...props}
        onChange={handleOnChange}
      />
    );
  }
);

NumberInput.displayName = 'NumberInput';

export { NumberInput };
