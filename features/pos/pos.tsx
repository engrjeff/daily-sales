"use client"

import { useState } from "react"

import { getUniqueCategoriesFromProducts } from "@/lib/utils"
import { useProducts } from "@/hooks/use-products"
import { Button } from "@/components/ui/button"
import { ClientSearchField } from "@/components/ui/client-search-field"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"

import { OrderSummary } from "./order-summary"
import { POSProducts } from "./pos-products"
import { POSSkeleton } from "./pos-skeleton"

export function POS() {
  const [selectedCategory, setSelectedCategory] = useState<string>()

  const [searchQuery, setSearchQuery] = useState("")

  const productsQuery = useProducts()

  if (productsQuery.isLoading) return <POSSkeleton />

  const categories = getUniqueCategoriesFromProducts(
    productsQuery.data?.map((c) => c.category) ?? []
  )

  let productsToDisplay = selectedCategory
    ? productsQuery.data?.filter((p) => p.categoryId === selectedCategory)
    : productsQuery.data

  productsToDisplay = searchQuery
    ? productsToDisplay?.filter((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : productsToDisplay

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <ScrollArea className="max-w-full">
        <div className="flex w-max items-center gap-3 p-0.5">
          <Button
            variant={selectedCategory === undefined ? "default" : "secondary"}
            size="sm"
            data-primary={selectedCategory === undefined}
            className="rounded-full data-[primary=false]:border"
            onClick={() => setSelectedCategory(undefined)}
          >
            All
          </Button>
          {categories.map((category) => (
            <Button
              key={`pos-category-${category.id}`}
              variant={
                selectedCategory === category.id ? "default" : "secondary"
              }
              data-primary={selectedCategory === category.id}
              size="sm"
              className="rounded-full data-[primary=false]:border"
              onClick={() => setSelectedCategory(category.id)}
            >
              {category.name}
            </Button>
          ))}

          <ClientSearchField
            className="bg-muted border-border rounded-full"
            placeholder="Search products"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.currentTarget.value)}
            onClearClick={() => setSearchQuery("")}
            autoComplete="off"
            name="pos products search"
            aria-label="Search Products"
          />
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
      <div className="flex items-start gap-2">
        <POSProducts products={productsToDisplay ?? []} />
        <OrderSummary />
      </div>
    </div>
  )
}
