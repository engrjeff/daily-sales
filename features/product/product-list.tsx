import Link from "next/link"
import { ImagePlusIcon } from "lucide-react"

import { Checkbox } from "@/components/ui/checkbox"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { EmptyView } from "@/components/empty-view"
import { Pagination } from "@/components/pagination"

import { ProductRowActions } from "./product-row-actions"
import { getProducts, GetProductsArgs } from "./queries"

function getTotalStock(stockArray: number[]) {
  const stockTotal = stockArray.reduce((sum, item) => sum + item, 0)

  if (stockTotal === 0)
    return <span className="text-red-500">Out of Stock</span>

  return <span>{stockTotal} in stock</span>
}

function getPriceRange(prices: number[]) {
  const min = Math.min(...prices)
  const max = Math.max(...prices)

  if (min === max) return `₱ ${min.toFixed(2)}`

  return `₱ ${min.toFixed(2)} - ₱ ${max.toFixed(2)}`
}

export async function ProductList({
  storeId,
  searchParams,
}: {
  storeId: string
  searchParams: Omit<GetProductsArgs, "storeId">
}) {
  const { products, pageInfo } = await getProducts({
    storeId,
    ...searchParams,
  })

  if (!products.length)
    return (
      <div className="flex flex-1 flex-col items-center justify-center rounded-lg border border-dashed">
        <EmptyView />
      </div>
    )

  return (
    <>
      <Table containerClass="border rounded-lg flex-1">
        <TableHeader>
          <TableRow className="bg-muted/30">
            <TableHead className="w-9 text-center">
              <Checkbox />
            </TableHead>
            <TableHead className="w-9 text-center">#</TableHead>
            <TableHead>Product Name</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Inventory</TableHead>
            <TableHead>Price</TableHead>
            <TableHead className="text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product, index) => (
            <TableRow key={`product-row-${product.id}`}>
              <TableHead className="w-9 text-center">
                <Checkbox />
              </TableHead>
              <TableCell className="w-9 text-center">{index + 1}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <div className="bg-muted/30 text-muted-foreground relative flex size-11 items-center justify-center rounded border">
                    <ImagePlusIcon size={16} />
                  </div>
                  <Link
                    href="#"
                    className="hover:text-blue-500 hover:underline"
                  >
                    {product.name}
                  </Link>
                </div>{" "}
              </TableCell>
              <TableCell>{product.category.name}</TableCell>
              <TableCell>
                {getTotalStock(product.variants.map((v) => v.stock))}
              </TableCell>
              <TableCell>
                {getPriceRange(product.variants.map((v) => v.price))}
              </TableCell>
              <TableCell className="text-center">
                <ProductRowActions
                  productId={product.id}
                  productName={product.name}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Pagination pageInfo={pageInfo} />
    </>
  )
}
