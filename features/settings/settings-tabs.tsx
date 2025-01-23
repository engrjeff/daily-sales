'use client';

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { parseAsString, useQueryState } from 'nuqs';
import { type ReactNode } from 'react';

export function SettingsTabs({ children }: { children: ReactNode }) {
  const [tabQuery, setTabQuery] = useQueryState(
    'tab',
    parseAsString.withDefault('settings')
  );

  return (
    <Tabs
      defaultValue={tabQuery}
      onValueChange={setTabQuery}
      className="flex size-full flex-col"
    >
      <TabsList className="h-auto w-full max-w-full justify-start gap-2 overflow-x-auto overflow-y-hidden rounded-none border-b border-neutral-800 bg-transparent p-2">
        <TabsTrigger
          value="settings"
          className="data-[state=active]:border-foreground rounded-md border-transparent px-2 py-1.5 hover:bg-neutral-800 data-[state=active]:bg-neutral-800"
        >
          Settings
        </TabsTrigger>
        <TabsTrigger
          value="discounts"
          className="data-[state=active]:border-foreground rounded-md border-transparent px-2 py-1.5 hover:bg-neutral-800 data-[state=active]:bg-neutral-800"
        >
          Discounts
        </TabsTrigger>
        <TabsTrigger
          value="goals"
          className="data-[state=active]:border-foreground rounded-md border-transparent px-2 py-1.5 hover:bg-neutral-800 data-[state=active]:bg-neutral-800"
        >
          Goals
        </TabsTrigger>
      </TabsList>

      {children}
    </Tabs>
  );
}
