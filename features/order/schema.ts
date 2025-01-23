import { OrderStatus, PaymentStatus } from "@prisma/client"
import * as z from "zod"

export const orderSchema = z.object({
  orderId: z.string(),
  orderDate: z.string(),
  orderStatus: z
    .nativeEnum(OrderStatus, { message: "Invalid order status." })
    .default(OrderStatus.PREPARING),
  paymentStatus: z
    .nativeEnum(PaymentStatus, { message: "Invalid payment status." })
    .default(PaymentStatus.PENDING),
  discountId: z.string().optional(),
  paymentMethod: z.string(),
  totalAmount: z.number().nonnegative(),
  regularAmount: z.number().nonnegative(),
  customerName: z.string().optional(),
  shippingFee: z.number().nonnegative(),
  serviceCharge: z.number().nonnegative(),
  lineItems: z.array(
    z.object({
      qty: z.number().int().nonnegative(),
      productVariantId: z.string(),
      productName: z.string(),
      unitPrice: z.number().nonnegative(),
      sku: z.string(),
      attributes: z.array(
        z.object({
          key: z.string(),
          value: z.string(),
        })
      ),
    })
  ),
})

export const withStoreId = z.object({
  storeId: z.string({
    required_error: "An order should be associated with a store.",
  }),
})

export const requireOrderId = z.object({
  id: z.string({
    required_error: "Order id is required.",
  }),
})

export const orderStatusSchema = z.object({
  id: z.string({
    required_error: "Order id is required.",
  }),
  orderStatus: z.nativeEnum(OrderStatus, {
    message: "Invalid order status.",
  }),
})

export const paymentStatusSchema = z.object({
  id: z.string({
    required_error: "Order id is required.",
  }),
  paymentStatus: z.nativeEnum(PaymentStatus, {
    message: "Invalid payment status.",
  }),
})

export type OrderInputs = z.infer<typeof orderSchema>
