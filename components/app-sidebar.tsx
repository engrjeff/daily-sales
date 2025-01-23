'use client';

import * as React from 'react';

import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from '@/components/ui/sidebar';
import { navigation } from '@/config/navigation';
import { Store } from '@prisma/client';
import { StoreSwitcher } from './store-switcher';

interface Props extends React.ComponentProps<typeof Sidebar> {
  stores: Store[];
}

export function AppSidebar({ stores, ...props }: Props) {
  return (
    <Sidebar variant="inset" {...props} className="border-r">
      <SidebarHeader>
        <StoreSwitcher stores={stores} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navigation.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
