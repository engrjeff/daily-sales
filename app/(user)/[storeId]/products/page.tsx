import { Metadata } from "next"
import Link from "next/link"
import { ProductCategoryFilter } from "@/features/product/product-category-filter"
import { ProductList } from "@/features/product/product-list"
import { GetProductsArgs } from "@/features/product/queries"
import { PlusCircle } from "lucide-react"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { SearchField } from "@/components/ui/search-field"

export const metadata: Metadata = {
  title: "Products",
}

function ProductsPage({
  params,
  searchParams,
}: {
  params: { storeId: string }
  searchParams: Omit<GetProductsArgs, "storeId">
}) {
  return (
    <div className="container flex max-w-5xl flex-1 flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-semibold">Products</h1>
          <p className="text-muted-foreground text-sm">
            View, create, and manage your products.
          </p>
        </div>
        <div className="flex items-center justify-between">
          <Link
            href={`/${params.storeId}/products/create`}
            className={cn(buttonVariants({ size: "sm" }), "ml-auto")}
          >
            <PlusCircle />
            Add Product
          </Link>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <SearchField
          className="bg-muted border-border w-[300px]"
          placeholder="Search product"
        />
        <div className="ml-auto flex items-center gap-2">
          <ProductCategoryFilter />
        </div>
      </div>

      <ProductList searchParams={searchParams} storeId={params.storeId} />
    </div>
  )
}

export default ProductsPage
