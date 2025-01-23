"use client"

import { Fragment, useState } from "react"
import { OrdersWithLineItems } from "@/features/order/queries"
import { ChevronDown, ChevronRight, MoreHorizontalIcon } from "lucide-react"

import { formatCurrency, formatDate } from "@/lib/utils"
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

export function SalesTable({ orders }: { orders: OrdersWithLineItems }) {
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

  return (
    <Table containerClass="border rounded-lg">
      <TableHeader>
        <TableRow className="bg-muted/30 hover:bg-muted/30">
          <TableHead className="w-[50px]"></TableHead>
          <TableHead>Order ID</TableHead>
          <TableHead>Order Date</TableHead>
          <TableHead className="text-right">Total Amount</TableHead>
          <TableHead className="text-right">Profit</TableHead>
          <TableHead className="text-right">Margin</TableHead>
          <TableHead className="text-center">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {!orders.length ? (
          <TableRow>
            <TableCell colSpan={7} className="p-0">
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
                <TableCell className="text-right">
                  {formatCurrency(order.totalAmount)}
                </TableCell>
                <TableCell className="text-right">
                  {formatCurrency(getProfit(order))}
                </TableCell>
                <TableCell className="text-right text-emerald-500">
                  {getProfitMargin(order)}
                </TableCell>
                <TableCell className="text-center">
                  <Button
                    size="icon"
                    variant="ghost"
                    className="size-7"
                    aria-label="actions"
                    onClick={(e) => {
                      e.stopPropagation()
                    }}
                  >
                    <MoreHorizontalIcon size={16} />
                  </Button>
                </TableCell>
              </TableRow>
              {expandedRows.has(order.id) && (
                <TableRow className="hover:bg-transparent">
                  <TableCell colSpan={7}>
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
                            <TableHead className="text-right">Total</TableHead>
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
                                -{formatCurrency(order.discount.discountAmount)}
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
  )
}

function getProfit(order: OrdersWithLineItems[number]) {
  const totalCost = order.lineItems.reduce(
    (cost, lineItem) => cost + lineItem.productVariant.costPrice,
    0
  )
  const totalPrice = order.lineItems.reduce(
    (price, lineItem) => price + lineItem.productVariant.price,
    0
  )

  const deductions = order.regularAmount - order.totalAmount

  const profit = totalPrice - totalCost - deductions

  return profit
}

// formula
// Profit Margin = (Total Sales - Total Cost) / Total Sales
function getProfitMargin(order: OrdersWithLineItems[number]) {
  const totalCost = order.lineItems.reduce(
    (cost, lineItem) => cost + lineItem.productVariant.costPrice,
    0
  )
  const totalPrice = order.lineItems.reduce(
    (price, lineItem) => price + lineItem.productVariant.price,
    0
  )

  const deductions = order.regularAmount - order.totalAmount

  const profit = totalPrice - totalCost - deductions

  const margin = profit / totalPrice

  return (margin * 100).toFixed(1) + "%"
}
