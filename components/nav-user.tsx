'use client';

import { SidebarMenu, SidebarMenuItem } from '@/components/ui/sidebar';
import { SignedIn, UserButton, useUser } from '@clerk/nextjs';
import { ChevronsUpDown } from 'lucide-react';

export function NavUser() {
  const { user } = useUser();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SignedIn>
          <div className="flex items-center gap-4">
            <UserButton />
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate text-sm font-semibold">
                {user?.fullName}
              </span>
              <span className="text-muted-foreground truncate text-xs">
                {user?.emailAddresses[0].emailAddress}
              </span>
            </div>
            <ChevronsUpDown className="ml-auto size-4" />
          </div>
        </SignedIn>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
