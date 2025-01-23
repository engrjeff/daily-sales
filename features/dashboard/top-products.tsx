"use client"

import Link from "next/link"
import { ArrowRightIcon, ImagePlusIcon } from "lucide-react"

import { formatCurrency } from "@/lib/utils"
import { useKPIs } from "@/hooks/use-kpis"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { EmptyView } from "@/components/empty-view"

export function TopProducts() {
  const kpiQuery = useKPIs()

  if (kpiQuery.isLoading)
    return (
      <Card>
        <Skeleton className="bg-muted h-[600px] animate-pulse" />
      </Card>
    )

  return (
    <Card className="bg-muted rounded-lg border">
      <CardHeader className="flex-row justify-between">
        <CardTitle>Top Products</CardTitle>
        <Link
          href="#"
          className="text-primary inline-flex items-center gap-2 text-sm hover:underline"
        >
          All Products <ArrowRightIcon size={16} className="size-4" />
        </Link>
      </CardHeader>
      <Table containerClass="flex-none">
        <TableHeader>
          <TableRow>
            <TableHead className="w-9 min-w-9 text-center">#</TableHead>
            <TableHead>Product Name</TableHead>
            <TableHead>SKU</TableHead>
            <TableHead className="text-right">Unit Price</TableHead>
            <TableHead className="text-right">Sold</TableHead>
            <TableHead className="text-right">Sales</TableHead>
            <TableHead aria-hidden="true"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {kpiQuery.data?.topProducts.length ? (
            kpiQuery.data.topProducts?.map((orderItem, index) => (
              <TableRow key={`top-product-${orderItem.id}`}>
                <TableHead className="w-9 text-center">{index + 1}</TableHead>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="bg-muted/30 text-muted-foreground relative flex size-11 items-center justify-center rounded border">
                      <ImagePlusIcon size={16} />
                    </div>
                    <div>
                      <Link
                        href="#"
                        className="hover:text-blue-500 hover:underline"
                      >
                        {orderItem.productName}
                      </Link>
                      <p className="text-muted-foreground text-xs">
                        {orderItem.attributes.map((a) => a.value).join(", ")}
                      </p>
                    </div>
                  </div>{" "}
                </TableCell>
                <TableCell>{orderItem.sku}</TableCell>
                <TableCell className="text-right">
                  {formatCurrency(orderItem.unitPrice)}
                </TableCell>
                <TableCell className="text-right">{orderItem.qty}</TableCell>
                <TableCell className="text-right">
                  {formatCurrency(orderItem.qty * orderItem.unitPrice)}
                </TableCell>
                <TableCell></TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={7}
                className="text-muted-foreground h-[500px] text-center text-base"
              >
                <EmptyView />
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </Card>
  )
}
