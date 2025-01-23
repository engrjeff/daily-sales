import { Separator } from '@/components/ui/separator';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { SignedIn, UserButton } from '@clerk/nextjs';

export function AppHeader() {
  return (
    <header className="sticky top-0 flex h-16 shrink-0 items-center gap-2 px-4">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <h1 className="font-semibold">Dashboard</h1>
      </div>
      <div className="ml-auto">
        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>
    </header>
  );
}
