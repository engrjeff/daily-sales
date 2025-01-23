'use client';

import { PlusCircleIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { useState } from 'react';
import { POS } from './pos';

export function POSAside() {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button size="sm">
          <PlusCircleIcon className="size-4" />
          <span>Enter Order</span>
        </Button>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="inset-y-2 right-2 flex h-auto w-[98%] flex-col gap-0 overflow-y-auto rounded-lg border p-0 focus-visible:outline-none sm:max-w-full"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <SheetHeader className="sr-only space-y-1 border-b p-4 text-left">
          <SheetTitle>Enter Order</SheetTitle>
          <SheetDescription>Place an order here.</SheetDescription>
        </SheetHeader>

        <POS />
      </SheetContent>
    </Sheet>
  );
}
