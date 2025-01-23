"use client"

import { type OrderStatus } from "@prisma/client"
import { useAction } from "next-safe-action/hooks"

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { useStoreId } from "../store/hooks"
import { updateOrderStatus } from "./actions"
import { orderStatuses } from "./helpers"

interface OrderStatusDropdownProps {
  orderId: string
  orderStatus: OrderStatus
}

export function OrderStatusDropdown({
  orderId,
  orderStatus,
}: OrderStatusDropdownProps) {
  const storeId = useStoreId()

  const action = useAction(updateOrderStatus)

  async function handleUpdate(status: OrderStatus) {
    // if same/unchanged, do nothing
    if (status === orderStatus) return

    await action.executeAsync({
      storeId,
      id: orderId,
      orderStatus: status,
    })
  }

  return (
    <Select value={orderStatus} onValueChange={handleUpdate}>
      <SelectTrigger className="w-full min-w-[105px]">
        <SelectValue placeholder="Select a status" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Order Status</SelectLabel>
          {orderStatuses.map((status) => (
            <SelectItem
              key={`${orderId}-order-status-${status.status}`}
              value={status.status}
            >
              {status.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
