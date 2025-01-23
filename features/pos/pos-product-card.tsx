"use client"

import { useState } from "react"
import NumberFlow from "@number-flow/react"
import { ImageIcon, Minus, Plus } from "lucide-react"

import { formatCurrency, getPriceRange } from "@/lib/utils"
import { ProductItem } from "@/hooks/use-products"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

import { usePOSOrdersStore } from "./pos-order-store"

export function POSProductCard({ product }: { product: ProductItem }) {
  const [qty, setQty] = useState(0)
  const [attributes, setAttributes] = useState<Record<string, string>>({})

  const store = usePOSOrdersStore()

  // find variants
  const selectedVariant = product.variants.find((v) =>
    v.productAttributeValues.every((attr) =>
      Object.values(attributes).includes(attr.attributeValueId)
    )
  )

  const outOfStockVariants = product.variants
    .filter((v) => v.stock === 0)
    .map((v) => v.id)

  const isOOS = selectedVariant
    ? outOfStockVariants.includes(selectedVariant?.id)
    : false

  function handleAddItem() {
    if (!selectedVariant || !qty) return

    const existing = store.lineItems.find(
      (line) => line.productVariantId === selectedVariant.id
    )

    if (existing) {
      store.updateLineItemQty(selectedVariant.id, qty)

      // reset state
      setQty(0)
      setAttributes({})

      return
    }

    store.addLineItem({
      productVariantId: selectedVariant?.id,
      productName: product.name,
      sku: selectedVariant.sku,
      unitPrice: selectedVariant.price,
      qty,
      attributes: selectedVariant.productAttributeValues.map((pv) => ({
        key: pv.attributeValue.attribute.name,
        value: pv.attributeValue.value,
      })),
    })

    // reset state
    setQty(0)
    setAttributes({})
  }

  return (
    <Card className="bg-muted flex h-full flex-col">
      <CardHeader className="flex flex-row items-start gap-4 p-4">
        <div className="bg-muted/30 text-muted-foreground relative flex size-11 items-center justify-center rounded border">
          <ImageIcon size={16} />
        </div>
        <div>
          <CardTitle>{product.name}</CardTitle>
          <CardDescription className="text-[13px] font-medium text-green-500">
            {selectedVariant
              ? formatCurrency(selectedVariant.price)
              : getPriceRange(product.variants.map((v) => v.price))}
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="flex flex-1 select-none flex-col gap-4 p-4 pt-0">
        <div className="flex-1 space-y-3">
          {product.attributes.map((attr) => (
            <fieldset key={`attr-${attr.id}`} className="space-y-4">
              <legend className="text-foreground text-sm font-medium leading-none">
                {attr.name}
              </legend>
              <RadioGroup
                className="grid grid-cols-4 gap-2"
                name={attr.name}
                value={attributes[attr.name as keyof typeof attributes] ?? ""}
                onValueChange={(val) => {
                  setAttributes((v) => ({ ...v, [attr.name]: val }))
                }}
              >
                {attr.values.map((option) => (
                  <label
                    key={option.id}
                    className="has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-accent has-[:focus-visible]:outline-primary/70 relative flex cursor-pointer flex-col items-center gap-3 rounded-lg border px-1.5 py-2 text-center text-sm shadow-sm shadow-black/5 outline-offset-2 transition-colors has-[[data-disabled]]:cursor-not-allowed has-[[data-disabled]]:opacity-50 has-[:focus-visible]:outline has-[:focus-visible]:outline-2"
                  >
                    <RadioGroupItem
                      id={option.id}
                      value={option.id}
                      className="sr-only after:absolute after:inset-0"
                    />
                    <p className="text-foreground text-sm font-medium leading-none">
                      {option.value}
                    </p>
                  </label>
                ))}
              </RadioGroup>
            </fieldset>
          ))}
        </div>

        <div
          data-oos={isOOS}
          className="mt-auto flex select-none items-center justify-between gap-4 pt-4 data-[oos=true]:cursor-not-allowed"
        >
          <div
            className="inline-flex shrink-0 items-center"
            role="group"
            aria-labelledby="quality-control"
          >
            <span id="quality-control" className="sr-only">
              Quantity Control
            </span>
            <Button
              type="button"
              variant="outline"
              size="icon"
              aria-label="Decrease quantity"
              className="border-border bg-background/60"
              onClick={() => setQty((q) => q - 1)}
              disabled={qty === 0 || isOOS}
            >
              <Minus size={16} strokeWidth={2} aria-hidden="true" />
            </Button>
            <div
              className="flex items-center px-3 text-center text-sm font-medium tabular-nums"
              aria-live="polite"
            >
              <NumberFlow
                value={qty}
                className="text-center"
                aria-label={`Current quantity is ${qty}`}
              />
            </div>
            <Button
              type="button"
              variant="outline"
              size="icon"
              aria-label="Increase quantity"
              className="border-border bg-background/60"
              onClick={() => setQty((q) => q + 1)}
              disabled={
                (product.attributes.length
                  ? product.attributes.length !== Object.keys(attributes).length
                  : false) || isOOS
              }
            >
              <Plus size={16} strokeWidth={2} aria-hidden="true" />
            </Button>
          </div>

          <Button
            type="button"
            size="sm"
            disabled={!selectedVariant || !qty || isOOS}
            onClick={handleAddItem}
            className="flex-1"
          >
            {isOOS ? "Out of stock" : "Add Item"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
