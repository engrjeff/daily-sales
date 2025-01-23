"use client"

import { Fragment, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { OrderStatus, PaymentStatus } from "@prisma/client"
import {
  ChevronDown,
  ChevronRight,
  MessageSquareWarning,
  MoreHorizontalIcon,
} from "lucide-react"

import { formatCurrency, formatDate } from "@/lib/utils"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { EmptyView } from "@/components/empty-view"

import { getOrderStatusLabel, getPaymentStatusLabel } from "./helpers"
import { OrderStatusDropdown } from "./order-status-dropdown"
import { PaymentStatusDropdown } from "./payment-status-dropdown"
import { OrdersWithLineItems } from "./queries"

export function OrdersTable({ orders }: { orders: OrdersWithLineItems }) {
  const pathname = usePathname()

  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set())

  const toggleRow = (orderId: string) => {
    const newExpandedRows = new Set(expandedRows)
    if (expandedRows.has(orderId)) {
      newExpandedRows.delete(orderId)
    } else {
      newExpandedRows.add(orderId)
    }
    setExpandedRows(newExpandedRows)
  }

  const unpaidOrdersCount = orders.filter(
    (o) => o.paymentStatus === PaymentStatus.PENDING
  ).length
  const pendingOrdersCount = orders.filter(
    (o) => o.orderStatus === OrderStatus.PREPARING
  ).length

  const showAlert = Boolean(unpaidOrdersCount || pendingOrdersCount)
  const withUnpaidAndPending = unpaidOrdersCount > 0 && pendingOrdersCount > 0

  return (
    <>
      {showAlert && (
        <Alert>
          <MessageSquareWarning className="size-4 text-yellow-500" />
          <AlertTitle>Heads up!</AlertTitle>
          <AlertDescription>
            You have{" "}
            {unpaidOrdersCount ? (
              <Link
                href={{
                  pathname,
                  query: { payment_status: PaymentStatus.PENDING },
                }}
                className="font-medium text-yellow-500 hover:underline"
              >
                {unpaidOrdersCount} unpaid{" "}
                {unpaidOrdersCount > 1 ? "orders" : "order"}
              </Link>
            ) : null}{" "}
            {withUnpaidAndPending ? "and " : ""}
            {pendingOrdersCount ? (
              <Link
                href={{
                  pathname,
                  query: { order_status: OrderStatus.PREPARING },
                }}
                className="font-medium text-yellow-500 hover:underline"
              >
                {pendingOrdersCount} pending{" "}
                {pendingOrdersCount > 1 ? "orders" : "order"}
              </Link>
            ) : null}
            .
          </AlertDescription>
        </Alert>
      )}
      <Table containerClass="border rounded-lg">
        <TableHeader>
          <TableRow className="bg-muted/30 hover:bg-muted/30">
            <TableHead className="w-[50px]"></TableHead>
            <TableHead>Order ID</TableHead>
            <TableHead>Order Date</TableHead>
            <TableHead>Care of</TableHead>
            <TableHead>Order Status</TableHead>
            <TableHead>Payment Status</TableHead>
            <TableHead className="text-right">Total Amount</TableHead>
            <TableHead className="text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {!orders.length ? (
            <TableRow className="hover:bg-transparent">
              <TableCell colSpan={8} className="p-0">
                <EmptyView />
              </TableCell>
            </TableRow>
          ) : (
            orders.map((order) => (
              <Fragment key={`order-${order.id}`}>
                <TableRow
                  className="cursor-pointer"
                  onClick={() => toggleRow(order.id)}
                >
                  <TableCell>
                    {expandedRows.has(order.id) ? (
                      <ChevronDown className="size-4" />
                    ) : (
                      <ChevronRight className="size-4" />
                    )}
                  </TableCell>
                  <TableCell className="font-medium">{order.orderId}</TableCell>
                  <TableCell>{formatDate(order.orderDate)}</TableCell>
                  <TableCell>{order.createdBy.name}</TableCell>
                  <TableCell>
                    {order.orderStatus === OrderStatus.PREPARING ? (
                      <OrderStatusDropdown
                        orderId={order.id}
                        orderStatus={order.orderStatus}
                      />
                    ) : (
                      <Badge variant={order.orderStatus}>
                        {getOrderStatusLabel(order.orderStatus)}
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {order.paymentStatus === PaymentStatus.PENDING ? (
                      <PaymentStatusDropdown
                        orderId={order.id}
                        paymentStatus={order.paymentStatus}
                      />
                    ) : (
                      <Badge variant={order.paymentStatus}>
                        {getPaymentStatusLabel(order.paymentStatus)}
                      </Badge>
                    )}
                  </TableCell>

                  <TableCell className="text-right">
                    {formatCurrency(order.totalAmount)}
                  </TableCell>
                  <TableCell className="text-center">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="size-7"
                      aria-label="actions"
                      onClick={(e) => {
                        e.stopPropagation()
                        alert("Ok")
                      }}
                    >
                      <MoreHorizontalIcon size={16} />
                    </Button>
                  </TableCell>
                </TableRow>
                {expandedRows.has(order.id) && (
                  <TableRow className="hover:bg-transparent">
                    <TableCell colSpan={8}>
                      <div className="px-2 py-4">
                        <div className="text-muted-foreground mb-2">
                          <p className="font-semibold">
                            Order Items ({order.lineItems.length})
                          </p>
                          <p>Customer: {order.customerName ?? "--"}</p>
                          <p>
                            Paid with{" "}
                            <span className="capitalize">
                              {order.paymentMethod}
                            </span>
                          </p>
                        </div>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Product</TableHead>
                              <TableHead className="text-right">Qty</TableHead>
                              <TableHead className="text-right">
                                Unit Price
                              </TableHead>
                              <TableHead className="text-right">
                                Total
                              </TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {order.lineItems.map((line) => (
                              <TableRow key={line.id}>
                                <TableCell>
                                  <div>
                                    <p className="text-sm font-medium">
                                      {line.productName}
                                    </p>
                                    <span className="text-muted-foreground text-xs">
                                      {line.attributes
                                        .map((a) => a.value)
                                        .join(", ")}
                                    </span>
                                  </div>
                                </TableCell>
                                <TableCell className="text-right">
                                  {line.qty}
                                </TableCell>
                                <TableCell className="text-right">
                                  {formatCurrency(line.unitPrice)}
                                </TableCell>
                                <TableCell className="text-right">
                                  {formatCurrency(line.qty * line.unitPrice)}
                                </TableCell>
                              </TableRow>
                            ))}

                            <TableRow className="border-b-0 hover:bg-transparent">
                              <TableCell
                                colSpan={3}
                                className="text-muted-foreground text-right"
                              >
                                Subtotal
                              </TableCell>
                              <TableCell className="text-right">
                                {formatCurrency(order.regularAmount)}
                              </TableCell>
                            </TableRow>
                            {order.shippingFee ? (
                              <TableRow className="border-b-0 hover:bg-transparent">
                                <TableCell
                                  colSpan={3}
                                  className="text-muted-foreground text-right"
                                >
                                  Shipping Fee
                                </TableCell>
                                <TableCell className="text-right">
                                  {formatCurrency(order.shippingFee)}
                                </TableCell>
                              </TableRow>
                            ) : null}
                            {order.serviceCharge ? (
                              <TableRow className="border-b-0 hover:bg-transparent">
                                <TableCell
                                  colSpan={3}
                                  className="text-muted-foreground text-right"
                                >
                                  Service Charge ({order.serviceCharge}%)
                                </TableCell>
                                <TableCell className="text-right">
                                  {formatCurrency(
                                    (order.serviceCharge / 100) *
                                      order.regularAmount
                                  )}
                                </TableCell>
                              </TableRow>
                            ) : null}
                            {order.discount ? (
                              <TableRow className="border-b-0 hover:bg-transparent">
                                <TableCell
                                  colSpan={3}
                                  className="text-muted-foreground text-right"
                                >
                                  Discount{" "}
                                  <span className="font-semibold text-green-500">
                                    ({order.discount.discountCode})
                                  </span>
                                </TableCell>
                                <TableCell className="text-right text-red-500">
                                  -
                                  {formatCurrency(
                                    order.discount.discountAmount
                                  )}
                                </TableCell>
                              </TableRow>
                            ) : null}
                            <TableRow className="hover:bg-transparent">
                              <TableCell
                                colSpan={3}
                                className="border-t border-dashed text-right font-semibold"
                              >
                                Total
                              </TableCell>
                              <TableCell className="border-t border-dashed text-right">
                                {formatCurrency(order.totalAmount)}
                              </TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </Fragment>
            ))
          )}
        </TableBody>
      </Table>
    </>
  )
}
