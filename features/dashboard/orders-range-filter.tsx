'use client';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

import { CalendarIcon } from 'lucide-react';

const ranges = [
  {
    value: 'this-week',
    label: 'This week',
  },
  {
    value: 'this-month',
    label: 'This month',
  },
  {
    value: 'this-year',
    label: 'This year',
  },
  {
    value: 'last-year',
    label: 'Last year',
  },
];

export function OrdersRangeFilter() {
  return (
    <div className="flex flex-col gap-4">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="bg-muted border-neutral-800"
          >
            <CalendarIcon size={16} strokeWidth={2} aria-hidden="true" /> Select
            Range
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-52 border-neutral-800 p-0" align="end">
          <div className="bg-muted/90 space-y-3 p-3">
            <div className="text-muted-foreground text-xs font-medium">
              Select Range
            </div>
            <form className="space-y-1">
              {ranges.map((range) => (
                <div
                  key={`range-${range.value}`}
                  className="hover:bg-primary/20 -ml-1.5 flex items-center gap-2 rounded-md p-1.5"
                >
                  <Checkbox id={`range-${range.value}`} />
                  <Label
                    htmlFor={`range-${range.value}`}
                    className="w-full font-normal"
                  >
                    {range.label}
                  </Label>
                </div>
              ))}
              <div
                role="separator"
                aria-orientation="horizontal"
                className="bg-border -mx-3 my-1 h-px"
              ></div>
              <div className="flex justify-between gap-2">
                <Button size="sm" variant="outline" className="h-7 px-2">
                  Clear
                </Button>
                <Button size="sm" className="h-7 px-2">
                  Apply
                </Button>
              </div>
            </form>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
