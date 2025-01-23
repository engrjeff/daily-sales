"use client"

import { PropsWithChildren } from "react"
import Link from "next/link"
import { useStoreId } from "@/features/store/hooks"

import { buttonVariants } from "./ui/button"

/**
 *
 * @param path like products, orders
 * @returns
 */
export function NotFoundCTA({
  path,
  children,
}: PropsWithChildren<{ path: string }>) {
  const storeId = useStoreId()

  return (
    <Link
      href={`/${storeId}/${path}`}
      className={buttonVariants({ size: "sm" })}
    >
      {children}
    </Link>
  )
}
