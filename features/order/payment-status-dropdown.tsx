"use client"

import { PaymentStatus } from "@prisma/client"
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
import { updatePaymentStatus } from "./actions"
import { paymentStatuses } from "./helpers"

interface PaymentStatusDropdownProps {
  orderId: string
  paymentStatus: PaymentStatus
}

export function PaymentStatusDropdown({
  orderId,
  paymentStatus,
}: PaymentStatusDropdownProps) {
  const storeId = useStoreId()

  const action = useAction(updatePaymentStatus)

  async function handleUpdate(status: PaymentStatus) {
    // if same/unchanged, do nothing
    if (status === paymentStatus) return

    await action.executeAsync({
      storeId,
      id: orderId,
      paymentStatus: status,
    })
  }

  return (
    <Select value={paymentStatus} onValueChange={handleUpdate}>
      <SelectTrigger className="w-full min-w-[105px]">
        <SelectValue placeholder="Select a status" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Payment Status</SelectLabel>
          {paymentStatuses.map((status) => (
            <SelectItem
              key={`${orderId}-payment-status-${status.status}`}
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
