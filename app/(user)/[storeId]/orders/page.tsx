import { Metadata } from "next"
import Link from "next/link"
import { OrderStatusFilter } from "@/features/order/orders-status-filter"
import { OrdersTable } from "@/features/order/orders-table"
import { PaymentStatusFilter } from "@/features/order/payment-status-filter"
import { getOrders, GetOrdersArgs } from "@/features/order/queries"
import { RangePresetFilter } from "@/features/order/range-preset-filters"
import { PlusCircleIcon } from "lucide-react"

import { buttonVariants } from "@/components/ui/button"
import { SearchField } from "@/components/ui/search-field"
import { Pagination } from "@/components/pagination"

export const metadata: Metadata = {
  title: "Orders",
}

async function OrdersPage({
  params,
  searchParams,
}: {
  params: { storeId: string }
  searchParams?: Omit<GetOrdersArgs, "storeId">
}) {
  const { orders, pageInfo } = await getOrders({
    storeId: params.storeId,
    ...searchParams,
  })

  return (
    <div className="container flex max-w-5xl flex-1 flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-semibold">Orders ({orders.length})</h1>
          <p className="text-muted-foreground text-sm">
            {"View, create, and manage your store's orders."}
          </p>
        </div>
        <div className="flex items-center justify-between">
          <Link
            className={buttonVariants({ size: "sm" })}
            href={`/${params.storeId}/pos`}
          >
            <PlusCircleIcon className="size-4" />
            <span>Enter Order</span>
          </Link>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <SearchField
          className="bg-muted border-border w-[300px]"
          placeholder="Search order number"
        />
        <div className="ml-auto flex items-center gap-2">
          <RangePresetFilter />
          <OrderStatusFilter />
          <PaymentStatusFilter />
        </div>
      </div>

      <OrdersTable orders={orders} />

      <Pagination pageInfo={pageInfo} />
    </div>
  )
}

export default OrdersPage
