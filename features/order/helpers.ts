import { OrderStatus, PaymentStatus } from "@prisma/client"

export const orderStatuses: Array<{ status: OrderStatus; label: string }> = [
  {
    status: OrderStatus.PREPARING,
    label: "Preparing",
  },
  {
    status: OrderStatus.READY_FOR_PICKUP,
    label: "For Pick Up",
  },
  {
    status: OrderStatus.FULFILLED,
    label: "Fulfilled",
  },
  {
    status: OrderStatus.UNFULFILLED,
    label: "Unfulfilled",
  },
  {
    status: OrderStatus.CANCELLED,
    label: "Cancelled",
  },
]

export const paymentStatuses: Array<{ status: PaymentStatus; label: string }> =
  [
    {
      status: PaymentStatus.PAID,
      label: "Paid",
    },
    {
      status: PaymentStatus.PENDING,
      label: "Pending",
    },
    {
      status: PaymentStatus.PARTIALLY_REFUNDED,
      label: "Partially Refunded",
    },
    {
      status: PaymentStatus.REFUNDED,
      label: "Refunded",
    },
  ]

const orderStatusMap: Record<OrderStatus, string> = {
  PREPARING: "Preparing",
  READY_FOR_PICKUP: "Ready for Pick Up",
  FULFILLED: "Fulfilled",
  UNFULFILLED: "Unfulfilled",
  CANCELLED: "Cancelled",
}

const paymentStatusMap: Record<PaymentStatus, string> = {
  PAID: "Paid",
  PENDING: "Pending",
  PARTIALLY_REFUNDED: "Partially Refunded",
  REFUNDED: "Refunded",
}

export const getOrderStatusLabel = (status: OrderStatus) =>
  orderStatusMap[status]

export const getPaymentStatusLabel = (status: PaymentStatus) =>
  paymentStatusMap[status]

export const getPaymentStatusColor = (status: PaymentStatus) => {
  switch (status) {
    case PaymentStatus.PAID:
      return "bg-green-400/20 text-green-400"
    case PaymentStatus.PENDING:
      return "bg-yellow-400/20 text-yellow-400"
    case PaymentStatus.REFUNDED:
      return "bg-red-400/20 text-red-400"
    default:
      return "bg-gray-400/20 text-gray-400"
  }
}
export const getOrderStatusColor = (status: OrderStatus) => {
  switch (status) {
    case OrderStatus.FULFILLED:
      return "bg-green-400/20 text-green-400"
    case OrderStatus.PREPARING:
      return "bg-yellow-400/20 text-yellow-400"
    case OrderStatus.READY_FOR_PICKUP:
      return "bg-violet-400/20 text-violet-400"
    case OrderStatus.UNFULFILLED:
      return "bg-red-400/20 text-red-400"
    default:
      return "bg-gray-400/20 text-gray-400"
  }
}
