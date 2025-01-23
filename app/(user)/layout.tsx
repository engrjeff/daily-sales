import { AppSidebar } from '@/components/app-sidebar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { getStores } from '@/features/store/queries';
import { type ReactNode } from 'react';

async function UserLayout({ children }: { children: ReactNode }) {
  const stores = await getStores();

  return (
    <SidebarProvider>
      <AppSidebar stores={stores} />
      <SidebarInset className="p-4 lg:p-6">{children}</SidebarInset>
    </SidebarProvider>
  );
}

export default UserLayout;
