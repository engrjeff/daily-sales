"use client"

import Link from "next/link"
import { useUser } from "@clerk/nextjs"
import { ArrowRightIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

import { useStoreId } from "../store/hooks"

export function POSStoreLink() {
  const storeId = useStoreId()

  const user = useUser()

  if (!user?.user) return null

  return (
    <div className="py-10 text-center">
      <Link
        className={cn(
          buttonVariants({ size: "sm", variant: "link" }),
          "text-blue-500"
        )}
        href={`/${storeId}/dashboard`}
      >
        Go to store dashboard <ArrowRightIcon />
      </Link>
    </div>
  )
}
