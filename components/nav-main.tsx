"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useStoreId } from "@/features/store/hooks"
import { SquareMousePointerIcon, type LucideIcon } from "lucide-react"

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

export function NavMain({
  items,
}: {
  items: {
    title: string
    items?: {
      title: string
      url: string
      icon: LucideIcon
      isActive?: boolean
    }[]
  }[]
}) {
  const storeId = useStoreId()

  const pathname = usePathname()

  return (
    <>
      {items.map((item) => (
        <SidebarGroup key={item.title}>
          <SidebarGroupLabel>{item.title}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {item.items?.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname.includes(item.url)}
                  >
                    <Link href={`/${storeId}${item.url}`}>
                      <item.icon /> {item.title}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      ))}

      <SidebarGroup>
        <SidebarGroupLabel>Apps</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={pathname.includes("/pos")}>
                <Link href={`/${storeId}/pos`}>
                  <SquareMousePointerIcon className="size-4" /> POS
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </>
  )
}
