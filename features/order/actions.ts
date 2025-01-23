"use server"

import { revalidatePath } from "next/cache"

import prisma from "@/lib/db"
import { requireEmployeeClient } from "@/lib/safe-action"

import { signOutEmployee } from "../employees/actions"
import {
  orderSchema,
  orderStatusSchema,
  paymentStatusSchema,
  withStoreId,
} from "./schema"

export const createOrder = requireEmployeeClient
  .metadata({ actionName: "createOrder" })
  .schema(withStoreId.merge(orderSchema))
  .action(async ({ parsedInput, ctx: { employee } }) => {
    if (!employee?.id) {
      await signOutEmployee()
      revalidatePath(`/${parsedInput.storeId}/pos`)

      throw new Error("Employee not found. Sign in again.")
    }

    const order = await prisma.order.create({
      data: {
        orderId: parsedInput.orderId,
        orderDate: new Date(parsedInput.orderDate),
        orderStatus: parsedInput.orderStatus,
        paymentStatus: parsedInput.paymentStatus,
        customerName: parsedInput.customerName,
        discountId:
          parsedInput.discountId === "" ? null : parsedInput.discountId,
        paymentMethod: parsedInput.paymentMethod,
        totalAmount: parsedInput.totalAmount,
        regularAmount: parsedInput.regularAmount,
        shippingFee: parsedInput.shippingFee,
        serviceCharge: parsedInput.serviceCharge,
        storeId: parsedInput.storeId,
        createdById: employee.id, // employee!
        lineItems: {
          create: parsedInput.lineItems.map((line) => ({
            productVariantId: line.productVariantId,
            productName: line.productName,
            sku: line.sku,
            qty: line.qty,
            unitPrice: line.unitPrice,
            attributes: {
              create: line.attributes,
            },
          })),
        },
      },
      select: {
        id: true,
      },
    })

    // also update the stock of variants
    await prisma.$transaction(
      parsedInput.lineItems.map((variant) => {
        return prisma.productVariant.update({
          where: {
            id: variant.productVariantId,
          },
          data: {
            stock: {
              decrement: variant.qty,
            },
          },
        })
      })
    )

    revalidatePath(`/${parsedInput.storeId}/orders`)

    return {
      order,
    }
  })

export const updateOrderStatus = requireEmployeeClient
  .metadata({ actionName: "updateOrderStatus" })
  .schema(orderStatusSchema.merge(withStoreId))
  .action(async ({ parsedInput, ctx: { employee } }) => {
    if (!employee?.id) {
      await signOutEmployee()

      revalidatePath(`/${parsedInput.storeId}/pos`)

      throw new Error("Employee not found. Sign in again.")
    }

    const order = await prisma.order.update({
      where: {
        id: parsedInput.id,
      },
      data: {
        orderStatus: parsedInput.orderStatus,
      },
    })

    revalidatePath(`/${parsedInput.storeId}/orders`)

    return order
  })

export const updatePaymentStatus = requireEmployeeClient
  .metadata({ actionName: "updatePaymentStatus" })
  .schema(paymentStatusSchema.merge(withStoreId))
  .action(async ({ parsedInput, ctx: { employee } }) => {
    if (!employee?.id) {
      await signOutEmployee()

      revalidatePath(`/${parsedInput.storeId}/pos`)

      throw new Error("Employee not found. Sign in again.")
    }

    const order = await prisma.order.update({
      where: {
        id: parsedInput.id,
      },
      data: {
        paymentStatus: parsedInput.paymentStatus,
      },
    })

    revalidatePath(`/${parsedInput.storeId}/orders`)

    return order
  })
