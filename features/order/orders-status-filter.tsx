"use client"

import { useState } from "react"
import { OrderStatus } from "@prisma/client"
import { CircleDashedIcon } from "lucide-react"
import { parseAsString, useQueryState } from "nuqs"

import { cn } from "@/lib/utils"
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

import { getOrderStatusLabel, orderStatuses } from "./helpers"

export function OrderStatusFilter() {
  const [open, setOpen] = useState(false)

  const [statusQuery, setStatusQuery] = useQueryState(
    "order_status",
    parseAsString.withDefault("").withOptions({ shallow: false })
  )

  const [selected, setSelected] = useState<string>(statusQuery)

  const [page, setPage] = usePageState()

  return (
    <div className="flex flex-col gap-4">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className={cn(
              "bg-muted border-neutral-800",
              statusQuery ? "pr-1" : ""
            )}
          >
            <CircleDashedIcon size={16} strokeWidth={2} aria-hidden="true" />{" "}
            Status{" "}
            {statusQuery ? (
              <Badge variant={statusQuery as OrderStatus}>
                {getOrderStatusLabel(statusQuery as OrderStatus)}
              </Badge>
            ) : null}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-52 p-3" align="end">
          <div className="space-y-3">
            <div className="text-muted-foreground text-xs font-medium">
              Order Status
            </div>
            <div className="space-y-1">
              {orderStatuses.map((status) => (
                <div
                  key={`order-status-${status.status}`}
                  className="hover:bg-muted -ml-1.5 flex items-center gap-2 rounded-md p-1.5"
                >
                  <Checkbox
                    id={`order-status-${status.status}`}
                    checked={selected === status.status}
                    onCheckedChange={(checked) => {
                      if (checked === true) {
                        setSelected(status.status)
                      } else {
                        setSelected("")
                      }
                    }}
                  />
                  <Label
                    htmlFor={`order-status-${status.status}`}
                    className="size-full cursor-pointer font-normal"
                  >
                    {status.label}
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
                    setStatusQuery("")
                    setOpen(false)
                  }}
                >
                  Clear
                </Button>
                <Button
                  size="sm"
                  className="h-7 px-2"
                  onClick={() => {
                    setStatusQuery(selected)
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
