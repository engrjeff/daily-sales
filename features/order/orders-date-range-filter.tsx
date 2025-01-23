'use client';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { useState } from 'react';

export function OrdersDateRangeFilter() {
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: undefined,
    to: undefined,
  });

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={cn(
            'bg-muted w-full justify-start border-neutral-800 text-left font-normal md:w-[220px]',
            !dateRange.from && !dateRange.to && 'text-muted-foreground'
          )}
        >
          <CalendarIcon className="mr-2 size-4" />
          {dateRange.from ? (
            dateRange.to ? (
              <>
                {format(dateRange.from, 'LLL dd, y')} -{' '}
                {format(dateRange.to, 'LLL dd, y')}
              </>
            ) : (
              format(dateRange.from, 'LLL dd, y')
            )
          ) : (
            'Pick a date range'
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="flex items-center justify-between gap-2 p-4">
          <p className="text-muted-foreground text-sm">Filter by date range</p>
          <Button type="button" size="sm">
            Apply
          </Button>
        </div>
        <Calendar
          initialFocus
          mode="range"
          defaultMonth={dateRange.from}
          selected={{ from: dateRange.from, to: dateRange.to }}
          onSelect={(range) => {
            setDateRange({
              from: range?.from,
              to: range?.to,
            });
          }}
          numberOfMonths={2}
        />
      </PopoverContent>
    </Popover>
  );
}
