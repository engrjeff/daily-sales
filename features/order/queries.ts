"use server"

import { OrderStatus, PaymentStatus, Prisma } from "@prisma/client"

import prisma from "@/lib/db"
import { DateRangePreset, getDateRange, getSkip } from "@/lib/utils"

import { checkIfOwnerOfStore } from "../store/queries"

const DEFAULT_PAGE = 1
const DEFAULT_PAGE_SIZE = 10

export type GetOrdersArgs = {
  storeId: string
  range?: DateRangePreset
  q?: string
  order_status?: OrderStatus
  payment_status?: PaymentStatus
  page?: number
  pageSize?: number
}

export const getOrders = async (args: GetOrdersArgs) => {
  await checkIfOwnerOfStore(args.storeId)

  const range = getDateRange(args.range ?? "today")

  const whereInput: Prisma.OrderWhereInput = {
    storeId: args.storeId,
    orderDate: {
      gte: range.start,
      lte: range.end,
    },
    orderId: {
      contains: args.q,
      mode: "insensitive",
    },
    orderStatus: args.order_status,
    paymentStatus: args.payment_status,
  }

  const totalFiltered = await prisma.order.count({
    where: whereInput,
  })

  const orders = await prisma.order.findMany({
    where: whereInput,
    include: {
      lineItems: {
        include: { attributes: true, productVariant: true },
      },
      discount: true,
      createdBy: {
        select: {
          name: true,
        },
      },
    },
    orderBy: {
      orderDate: "desc",
    },
    take: args?.pageSize ?? DEFAULT_PAGE_SIZE,
    skip: getSkip({ limit: DEFAULT_PAGE_SIZE, page: args?.page }),
  })

  const pageInfo = {
    total: totalFiltered,
    page: !isNaN(args.page!) ? Number(args?.page) : DEFAULT_PAGE,
    pageSize: DEFAULT_PAGE_SIZE,
    itemCount: orders.length,
    totalPages: Math.ceil(totalFiltered / DEFAULT_PAGE_SIZE),
  }

  return { orders, pageInfo }
}

type ThenArg<T> = T extends PromiseLike<infer U> ? U : T

export type OrdersWithLineItems = ThenArg<
  ReturnType<typeof getOrders>
>["orders"]
