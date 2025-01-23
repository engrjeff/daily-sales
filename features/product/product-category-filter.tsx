"use client"

import { useState } from "react"
import { ListFilterIcon } from "lucide-react"
import { parseAsString, useQueryState } from "nuqs"

import { cn } from "@/lib/utils"
import { useCategories } from "@/hooks/use-categories"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { usePageState } from "@/components/pagination"

export function ProductCategoryFilter() {
  const [open, setOpen] = useState(false)

  const [categoryQuery, setCategoryQuery] = useQueryState(
    "categoryId",
    parseAsString.withDefault("").withOptions({ shallow: false })
  )

  const [selected, setSelected] = useState<string>(categoryQuery)

  const [page, setPage] = usePageState()

  const categories = useCategories()

  const selectedCategory = categories.data?.find(
    (cat) => cat.id === categoryQuery
  )

  return (
    <div className="flex flex-col gap-4">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            disabled={categories.isLoading}
            className={cn(
              "bg-muted border-neutral-800",
              categoryQuery ? "pr-1" : ""
            )}
          >
            <ListFilterIcon size={16} strokeWidth={2} aria-hidden="true" />{" "}
            Category
            {categoryQuery && selectedCategory ? (
              <Badge variant="filter">{selectedCategory.name}</Badge>
            ) : null}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-52 p-3" align="end">
          <div className="space-y-3">
            <div className="text-muted-foreground text-xs font-medium">
              Categories
            </div>
            <div className="space-y-1">
              {categories.data?.map((category) => (
                <div
                  key={`category-${category.id}`}
                  className="hover:bg-muted -ml-1.5 flex items-center gap-2 rounded-md p-1.5"
                >
                  <Checkbox
                    id={`category-${category.id}`}
                    checked={selected === category.id}
                    onCheckedChange={(checked) => {
                      if (checked === true) {
                        setSelected(category.id)
                      } else {
                        setSelected("")
                      }
                    }}
                  />
                  <Label
                    htmlFor={`category-${category.id}`}
                    className="size-full cursor-pointer font-normal"
                  >
                    {category.name}
                  </Label>
                </div>
              ))}
              <div
                role="separator"
                aria-orientation="horizontal"
                className="bg-border -mx-3 h-px"
              ></div>
              <div className="flex justify-between gap-2 pt-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="h-7 px-2"
                  onClick={() => {
                    setSelected("")
                    setCategoryQuery("")
                    setOpen(false)
                  }}
                >
                  Clear
                </Button>
                <Button
                  size="sm"
                  className="h-7 px-2"
                  onClick={() => {
                    setCategoryQuery(selected)
                    setOpen(false)

                    if (page) {
                      setPage(null)
                    }
                  }}
                >
                  Apply
                </Button>
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
