"use client"

import { useState } from "react"
import Link from "next/link"
import { MoreHorizontalIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { useStoreId } from "../store/hooks"
import { ProductDeleteDialog } from "./product-delete-dialog"

type RowAction = "copy" | "low-stock" | "delete" | "edit"

export function ProductRowActions({
  productId,
  productName,
}: {
  productId: string
  productName: string
}) {
  const [action, setAction] = useState<RowAction>()

  const storeId = useStoreId()

  return (
    <>
      <div className="flex items-center justify-center">
        <Button asChild size="sm" variant="link" className="text-blue-500">
          <Link href={`/${storeId}/products/${productId}`}>Edit</Link>
        </Button>
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="hover:bg-muted/30 size-8 hover:border"
            >
              <span className="sr-only">Actions</span>
              <MoreHorizontalIcon className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link
                href={`/${storeId}/products/create?copyId=${productId}`}
                target="_blank"
              >
                Copy
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setAction("low-stock")}>
              Low Stock Reminder
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setAction("delete")}
              className="text-red-500 focus:text-red-500"
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <ProductDeleteDialog
        productId={productId}
        productName={productName}
        open={action === "delete"}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            setAction(undefined)
          }
        }}
      />
    </>
  )
}
