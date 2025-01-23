import { NextRequest, NextResponse } from "next/server"
import { OrderStatus, PaymentStatus } from "@prisma/client"

import prisma from "@/lib/db"
import { calcPercentDiff, formatCurrency, getDateRange } from "@/lib/utils"

export const dynamic = "force-dynamic"

// get KPIs
// 1. best-selling product
// 2. sales for the day
// 3. orders for this day
// 4. discounts given
export async function GET(
  request: NextRequest,
  { params }: { params: { storeId: string } }
) {
  try {
    const range = getDateRange("today")

    const yesterday = getDateRange("yesterday")

    const ordersQuery = prisma.order.findMany({
      where: {
        storeId: params.storeId,
        orderDate: {
          gte: range.start,
          lte: range.end,
        },
        orderStatus: OrderStatus.FULFILLED,
        paymentStatus: PaymentStatus.PAID,
      },
      include: {
        discount: true,
        lineItems: {
          include: { attributes: true },
        },
      },
    })

    const yesterdayOrdersQuery = prisma.order.findMany({
      where: {
        storeId: params.storeId,
        orderDate: {
          gte: yesterday.start,
          lte: yesterday.end,
        },
        orderStatus: OrderStatus.FULFILLED,
        paymentStatus: PaymentStatus.PAID,
      },
      include: {
        discount: true,
        lineItems: true,
      },
    })

    const [orders, yesterdayOrders] = await Promise.all([
      ordersQuery,
      yesterdayOrdersQuery,
    ])

    const sales = orders.reduce((subSalesTotal, order) => {
      return subSalesTotal + order.totalAmount
    }, 0)

    const salesYesterday = yesterdayOrders.reduce((subSalesTotal, order) => {
      return subSalesTotal + order.totalAmount
    }, 0)

    const ordersWithDiscount = orders.filter((o) => o.discountId)

    const todalDiscount = ordersWithDiscount.reduce(
      (d, order) => d + Number(order.discount?.discountAmount),
      0
    )

    const orderItems = orders
      .map((order) => {
        return order.lineItems
      })
      .flat()

    orderItems.sort((a, b) => b.qty - a.qty)

    const bestSeller = orderItems.at(0)

    const bestSellerItem = orderItems.filter(
      (o) => o.productVariantId === bestSeller?.productVariantId
    )

    const orderItemsCount = orderItems.reduce((c, i) => c + i.qty, 0)

    const yesterdayOrderItemsCount = yesterdayOrders.reduce(
      (c, i) => c + i.lineItems.length,
      0
    )

    const topProductsMap = new Map<string, (typeof orderItems)[number]>()

    orderItems.forEach((item) => {
      if (topProductsMap.has(item.productVariantId)) {
        const thisItemQty = topProductsMap.get(item.productVariantId)?.qty ?? 0

        topProductsMap.set(item.productVariantId, {
          ...item,
          qty: thisItemQty + item.qty,
        })
      } else {
        topProductsMap.set(item.productVariantId, item)
      }
    })

    const topProducts = Array.from(topProductsMap.values())

    topProducts.sort((a, b) => b.qty * b.unitPrice - a.qty * a.unitPrice)

    const kpiData = {
      sales: {
        today: sales,
        todayFormatted: formatCurrency(sales),
        yesterday: salesYesterday,
        yesterdayFormatted: formatCurrency(salesYesterday),
        percentDiff: calcPercentDiff(sales, salesYesterday),
        trend:
          sales === salesYesterday
            ? "equal"
            : sales > salesYesterday
              ? "up"
              : "down",
      },
      orders: {
        today: orders.length,
        orderItemsCount,
        yesterday: yesterdayOrders.length,
        yesterdayOrderItemsCount,
        percentDiff: calcPercentDiff(orderItemsCount, yesterdayOrderItemsCount),
        trend:
          orderItemsCount === yesterdayOrderItemsCount
            ? "equal"
            : orderItemsCount > yesterdayOrderItemsCount
              ? "up"
              : "down",
      },
      discount: {
        ordersCount: ordersWithDiscount.length,
        total: todalDiscount,
        totalFormatted: formatCurrency(todalDiscount),
      },
      bestSeller: {
        ...bestSeller,
        orderCount: bestSellerItem.reduce((t, i) => t + i.qty, 0),
      },
      topProducts: topProducts.slice(0, 5), // first 5 only
    }

    return NextResponse.json(kpiData)
  } catch (error) {
    console.log("Get KPIs Error: ", error)

    return NextResponse.json({})
  }
}
