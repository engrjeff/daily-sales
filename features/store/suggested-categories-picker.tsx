"use client"

import { useState } from "react"
import { PlusIcon } from "lucide-react"

import { suggestedCategories } from "@/config/constants"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"

interface SuggestedCategoriesPickerProps {
  value: string[]
  onValueChange: (categories: string[]) => void
}

export function SuggestedCategoriesPicker({
  value,
  onValueChange,
}: SuggestedCategoriesPickerProps) {
  const [open, setOpen] = useState(false)

  const [selected, setSelected] = useState(() => value)

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen} modal={false}>
        <DialogTrigger asChild>
          <Button variant="outline">
            <PlusIcon size={16} strokeWidth={2} aria-hidden="true" /> Select
            categories
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>Categories</DialogTitle>
            <DialogDescription>Click a category to select.</DialogDescription>
          </DialogHeader>
          <div>
            <div className="text-muted-foreground mb-2 text-sm font-medium">
              Categories
            </div>
            <div className="flex flex-wrap items-center gap-3">
              {suggestedCategories.map((item) => (
                <div
                  key={`suggested-category-${item}`}
                  className="hover:bg-muted has-[[data-state=checked]]:border-ring has-[[data-state=checked]]:bg-primary/10 -ml-1.5 flex items-center gap-2 rounded-full border px-2.5 py-2"
                >
                  <Checkbox
                    id={`suggested-category-${item}`}
                    checked={selected.includes(item)}
                    onCheckedChange={(checked) => {
                      if (checked === true) {
                        setSelected([...selected, item])
                      } else {
                        setSelected(selected.filter((c) => c !== item))
                      }
                    }}
                  />
                  <Label
                    htmlFor={`suggested-category-${item}`}
                    className="size-full cursor-pointer text-sm font-normal"
                  >
                    {item}
                  </Label>
                </div>
              ))}
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="ghost"
              onClick={() => onValueChange([])}
            >
              Clear
            </Button>
            <Button
              type="button"
              onClick={() => {
                onValueChange(selected)
                setOpen(false)
              }}
            >
              Done
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="flex flex-wrap items-center gap-2 pt-2">
        {value.slice(0, 3).map((cat) => (
          <Badge key={`selected-category-${cat}`} variant="FULFILLED">
            {cat}
          </Badge>
        ))}

        {value.length > 3 ? (
          <Badge variant="FULFILLED">+{value.length - 3} more</Badge>
        ) : null}
      </div>
    </>
  )
}
