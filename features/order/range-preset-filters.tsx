'use client';

import { usePageState } from '@/components/pagination';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

import { cn, DateRangePreset } from '@/lib/utils';
import { CalendarIcon } from 'lucide-react';
import { parseAsString, useQueryState } from 'nuqs';
import { useState } from 'react';

const presets: Array<{ label: string; value: DateRangePreset }> = [
  {
    value: 'today',
    label: 'Today',
  },
  {
    value: 'yesterday',
    label: 'Yesterday',
  },
  {
    value: 'this_week',
    label: 'This week',
  },
  {
    value: 'last_week',
    label: 'Last week',
  },
  {
    value: 'this_month',
    label: 'This month',
  },
  {
    value: 'last_month',
    label: 'Last month',
  },
  {
    value: 'this_year',
    label: 'This year',
  },
  {
    value: 'last_year',
    label: 'Last year',
  },
];

export function RangePresetFilter() {
  const [open, setOpen] = useState(false);

  const [presetQuery, setPresetQuery] = useQueryState(
    'range',
    parseAsString.withDefault('today').withOptions({ shallow: false })
  );

  const [selected, setSelected] = useState<string>(presetQuery);

  const [page, setPage] = usePageState();

  const activeFilter = presets.find((p) => p.value === presetQuery)?.label;

  return (
    <div className="flex flex-col gap-4">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className={cn(
              'bg-muted border-neutral-800',
              activeFilter ? 'pr-1' : ''
            )}
          >
            <CalendarIcon size={16} strokeWidth={2} aria-hidden="true" /> Range{' '}
            {activeFilter ? (
              <Badge variant="filter">{activeFilter}</Badge>
            ) : null}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-52 p-3" align="end">
          <div className="space-y-3">
            <div className="text-muted-foreground text-xs font-medium">
              Date Range Presets
            </div>
            <div className="space-y-1">
              {presets.map((preset) => (
                <div
                  key={`date-range-preset-${preset.value}`}
                  className="hover:bg-muted -ml-1.5 flex items-center gap-2 rounded-md p-1.5"
                >
                  <Checkbox
                    id={`date-range-preset-${preset.value}`}
                    checked={selected === preset.value}
                    onCheckedChange={(checked) => {
                      if (checked === true) {
                        setSelected(preset.value);
                      }
                    }}
                  />
                  <Label
                    htmlFor={`date-range-preset-${preset.value}`}
                    className="size-full cursor-pointer font-normal"
                  >
                    {preset.label}
                  </Label>
                </div>
              ))}
              <div
                role="separator"
                aria-orientation="horizontal"
                className="bg-border -mx-3 h-px"
              ></div>
              <div className="flex justify-between gap-2 pt-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="h-7 px-2"
                  onClick={() => {
                    setSelected('today');
                    setPresetQuery('today');
                    setOpen(false);
                  }}
                >
                  Clear
                </Button>
                <Button
                  size="sm"
                  className="h-7 px-2"
                  onClick={() => {
                    setPresetQuery(selected);
                    setOpen(false);

                    if (page) {
                      setPage(null);
                    }
                  }}
                >
                  Apply
                </Button>
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
