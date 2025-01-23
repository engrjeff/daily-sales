"use client"

import { useState } from "react"
import Link from "next/link"
import { Category } from "@prisma/client"
import { MoreHorizontalIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { CategoryDeleteDialog } from "./category-delete-dialog"
import { CategoryEditForm } from "./category-edit-form"

type RowAction = "delete" | "edit"

export function CategoryRowActions({ category }: { category: Category }) {
  const [action, setAction] = useState<RowAction>()

  return (
    <>
      <div className="flex items-center justify-center">
        <CategoryEditForm category={category} />
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
                href={`/${category.storeId}/products?categoryId=${category.id}`}
              >
                View Products
              </Link>
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

      <CategoryDeleteDialog
        categoryId={category.id}
        categoryName={category.name}
        open={action === "delete"}
        setOpen={(isOpen) => {
          if (!isOpen) {
            setAction(undefined)
          }
        }}
      />
    </>
  )
}
