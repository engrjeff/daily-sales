"use client"

import { usePathname } from "next/navigation"
import { useStoreId } from "@/features/store/hooks"
import { StoreFormDialog } from "@/features/store/store-form-dialog"
import { Store } from "@prisma/client"
import { CheckIcon, ChevronsUpDown } from "lucide-react"

import { getInitials } from "@/lib/utils"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"

import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"

export function StoreSwitcher({ stores }: { stores: Store[] }) {
  const { isMobile } = useSidebar()

  const storeId = useStoreId()

  const activeStore = stores.find((s) => s.id === storeId) ?? stores[0]

  const pathname = usePathname()

  const pageRoute =
    pathname.split("/").filter(Boolean).slice(1, 2).join("/") ?? "dashboard"

  if (!activeStore) return null

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="size-8 rounded-md">
                <AvatarImage
                  src={activeStore.logoUrl!}
                  alt={activeStore.name}
                />
                <AvatarFallback
                  className="bg-primary text-foreground rounded-md"
                  style={{
                    backgroundColor: activeStore.color ?? "",
                  }}
                >
                  {getInitials(activeStore.name)}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">
                  {activeStore.name}
                </span>
                <span className="truncate text-xs">
                  {activeStore.description}
                </span>
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-muted-foreground text-xs">
              Stores
            </DropdownMenuLabel>
            {stores.map((store) => (
              <DropdownMenuItem key={store.name} className="gap-2 p-2" asChild>
                <a href={`/${store.id}/${pageRoute}`}>
                  <Avatar className="size-6 rounded-md">
                    <AvatarImage src={store.logoUrl!} alt={store.name} />
                    <AvatarFallback
                      className="bg-primary text-foreground rounded-md"
                      style={{
                        backgroundColor: activeStore.color ?? "",
                      }}
                    >
                      {getInitials(store.name)}
                    </AvatarFallback>
                  </Avatar>
                  {store.name}

                  {store.id === activeStore.id ? (
                    <CheckIcon className="ml-auto text-emerald-500" />
                  ) : null}
                </a>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <StoreFormDialog isModal={true} />
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
