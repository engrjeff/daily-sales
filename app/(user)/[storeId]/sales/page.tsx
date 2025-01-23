import { Metadata } from "next"
import { getOrders, GetOrdersArgs } from "@/features/order/queries"
import { RangePresetFilter } from "@/features/order/range-preset-filters"
import { SalesTable } from "@/features/sales/sales-table"

import { SearchField } from "@/components/ui/search-field"
import { Pagination } from "@/components/pagination"

export const metadata: Metadata = {
  title: "Sales",
}

async function SalesPage({
  params,
  searchParams,
}: {
  params: { storeId: string }
  searchParams?: Omit<GetOrdersArgs, "storeId">
}) {
  const { orders, pageInfo } = await getOrders({
    storeId: params.storeId,
    order_status: "FULFILLED",
    payment_status: "PAID",
    ...searchParams,
  })

  return (
    <div className="container flex max-w-5xl flex-1 flex-col gap-6">
      <div>
        <h1 className="font-semibold">Sales Transactions</h1>
        <p className="text-muted-foreground text-sm">
          {"View insights from your store's sales."}
        </p>
      </div>

      <div className="flex items-center gap-2">
        <SearchField
          className="bg-muted border-border w-[300px]"
          placeholder="Search order number"
        />
        <div className="ml-auto flex items-center gap-2">
          <RangePresetFilter />
        </div>
      </div>

      <SalesTable orders={orders} />

      <Pagination pageInfo={pageInfo} />
    </div>
  )
}

export default SalesPage
