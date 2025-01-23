"use client"

import { OrderLineItem } from "@prisma/client"
import { create } from "zustand"

export interface LineItem extends Omit<OrderLineItem, "id"> {
  attributes: Array<{ key: string; value: string }>
}

interface UsePOSOrdersStoreState {
  lineItems: LineItem[]
  addLineItem: (line: LineItem) => void
  increaseQty: (lineId: string) => void
  decreaseQty: (lineId: string) => void
  removeLineItem: (lineId: string) => void
  updateLineItemQty: (lineId: string, qty: number) => void
  resetLineItems: () => void
}

export const usePOSOrdersStore = create<UsePOSOrdersStoreState>((set) => ({
  lineItems: [],
  resetLineItems: () => set((state) => ({ ...state, lineItems: [] })),
  addLineItem: (line) =>
    set((state) => ({ ...state, lineItems: [...state.lineItems, line] })),
  removeLineItem: (lineId) =>
    set((state) => {
      const updatedLineItems = state.lineItems.filter(
        (l) => l.productVariantId !== lineId
      )

      return {
        ...state,
        lineItems: updatedLineItems,
      }
    }),
  updateLineItemQty: (lineId, qty) =>
    set((state) => {
      const updatedLineItems = state.lineItems.map((l) =>
        l.productVariantId === lineId ? { ...l, qty: l.qty + qty } : l
      )

      return {
        ...state,
        lineItems: updatedLineItems,
      }
    }),
  increaseQty: (lineId) =>
    set((state) => {
      const updatedLineItems = state.lineItems.map((l) =>
        l.productVariantId === lineId ? { ...l, qty: l.qty + 1 } : l
      )

      return {
        ...state,
        lineItems: updatedLineItems,
      }
    }),
  decreaseQty: (lineId) =>
    set((state) => {
      const updatedLineItems = state.lineItems.map((l) =>
        l.productVariantId === lineId ? { ...l, qty: l.qty - 1 } : l
      )

      return {
        ...state,
        lineItems: updatedLineItems,
      }
    }),
}))
