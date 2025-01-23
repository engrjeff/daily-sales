"use client"

import {
  BadgePercentIcon,
  EqualIcon,
  ShoppingBagIcon,
  StoreIcon,
  TrendingDownIcon,
  TrendingUpIcon,
} from "lucide-react"

import { useKPIs } from "@/hooks/use-kpis"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function KPIs() {
  const kpiQuery = useKPIs()

  if (kpiQuery.isLoading)
    return (
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Skeleton className="bg-muted text-card-foreground h-[122px] animate-pulse rounded-xl border shadow" />
        <Skeleton className="bg-muted text-card-foreground h-[122px] animate-pulse rounded-xl border shadow" />
        <Skeleton className="bg-muted text-card-foreground h-[122px] animate-pulse rounded-xl border shadow" />
        <Skeleton className="bg-muted text-card-foreground h-[122px] animate-pulse rounded-xl border shadow" />
      </div>
    )

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
      <Card className="bg-muted border-l-primary flex flex-col border-l-4">
        <CardHeader className="flex-row items-start justify-between space-y-0 pb-0">
          <CardDescription className="font-medium text-white">
            Best Seller
          </CardDescription>
          <TrendingUpIcon size={20} className="size-5 text-white" />
        </CardHeader>
        <CardContent className="mt-auto">
          <div className="mb-2">
            <p className="text-lg font-bold leading-none">
              {kpiQuery.data?.bestSeller.productName}{" "}
            </p>
            {kpiQuery.data?.bestSeller.attributes?.length ? (
              <span className="text-muted-foreground text-xs leading-none">
                {kpiQuery.data?.bestSeller.attributes
                  ?.map((a) => a.value)
                  .join(", ")}
              </span>
            ) : null}
          </div>
          <div className="flex items-center gap-1.5 text-sm">
            <p className="text-muted-foreground font-medium">
              {kpiQuery.data?.bestSeller.orderCount}{" "}
              {Number(kpiQuery.data?.bestSeller.orderCount) > 1
                ? "items sold"
                : "item sold"}
            </p>
          </div>
        </CardContent>
      </Card>
      <Card className="bg-muted/80 flex flex-col border-neutral-800">
        <CardHeader className="flex-row items-start justify-between space-y-0 pb-0">
          <CardDescription className="font-medium">Daily Sales</CardDescription>
          <StoreIcon size={20} className="text-muted-foreground size-5" />
        </CardHeader>
        <CardContent className="mt-auto">
          <p className="mb-1 text-xl font-bold">
            {kpiQuery.data?.sales.todayFormatted}
          </p>
          <div className="flex items-center gap-1.5 text-sm">
            <p className="text-muted-foreground font-medium">
              {kpiQuery.data?.orders.today} orders
            </p>
            <Trend
              trend={kpiQuery.data?.sales.trend}
              value={kpiQuery.data?.sales.percentDiff ?? 0}
            />
          </div>
        </CardContent>
      </Card>
      <Card className="bg-muted/80 flex flex-col border-neutral-800">
        <CardHeader className="flex-row items-start justify-between space-y-0 pb-0">
          <CardDescription className="font-medium">
            Items Ordered Today
          </CardDescription>
          <ShoppingBagIcon size={20} className="text-muted-foreground size-5" />
        </CardHeader>
        <CardContent className="mt-auto">
          <p className="mb-1 text-xl font-bold">
            {kpiQuery.data?.orders.orderItemsCount}{" "}
            <span className="text-muted-foreground text-xs font-normal">
              / {kpiQuery.data?.orders.today} orders
            </span>
          </p>
          <div className="flex items-center gap-1.5 text-sm">
            <p className="text-muted-foreground font-medium">
              {kpiQuery.data?.orders.yesterdayOrderItemsCount} yesterday
            </p>
            <Trend
              trend={kpiQuery.data?.orders.trend}
              value={kpiQuery.data?.orders.percentDiff ?? 0}
            />
          </div>
        </CardContent>
      </Card>
      <Card className="bg-muted/80 flex flex-col border-neutral-800">
        <CardHeader className="flex-row items-start justify-between space-y-0 pb-0">
          <CardDescription className="font-medium">Discounts</CardDescription>
          <BadgePercentIcon
            size={20}
            className="text-muted-foreground size-5"
          />
        </CardHeader>
        <CardContent className="mt-auto">
          <p className="mb-1 text-xl font-bold">
            {kpiQuery.data?.discount.totalFormatted}
          </p>
          <div className="flex items-center gap-1.5 text-sm">
            <p className="text-muted-foreground font-medium">
              {kpiQuery.data?.discount.ordersCount}{" "}
              {Number(kpiQuery.data?.discount.ordersCount) > 1
                ? "orders"
                : "order"}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function Trend({ trend, value }: { value: number; trend?: string }) {
  if (trend === "equal")
    return (
      <div className="inline-flex items-center gap-1 text-amber-500">
        <EqualIcon size={16} className="size-4" />{" "}
        <span>{value.toFixed(1)}%</span>
      </div>
    )

  if (trend === "up")
    return (
      <div className="inline-flex items-center gap-1 text-green-500">
        <TrendingUpIcon size={16} className="size-4" />{" "}
        <span>{value.toFixed(1)}%</span>
      </div>
    )

  if (trend === "down")
    return (
      <div className="inline-flex items-center gap-1 text-red-500">
        <TrendingDownIcon size={16} className="size-4" />{" "}
        <span>{value.toFixed(1)}%</span>
      </div>
    )

  return null
}
