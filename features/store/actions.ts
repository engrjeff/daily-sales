"use server"

import { revalidatePath } from "next/cache"

import prisma from "@/lib/db"
import { authActionClient } from "@/lib/safe-action"

import {
  createStoreSchema,
  discountSchema,
  setGoalsSchema,
  updateStoreSchema,
} from "./schema"

export const createStore = authActionClient
  .metadata({ actionName: "createStore" })
  .schema(createStoreSchema)
  .action(
    async ({ parsedInput: { categories, ...storeData }, ctx: { user } }) => {
      const store = await prisma.store.create({
        data: {
          ...storeData,
          ownerId: user.userId,
        },
        select: {
          id: true,
        },
      })

      // create categories
      await prisma.category.createMany({
        data: categories.map((cat) => ({
          storeId: store.id,
          name: cat,
        })),
      })

      return {
        store,
      }
    }
  )

export const updateStore = authActionClient
  .metadata({ actionName: "updateStore" })
  .schema(updateStoreSchema)
  .action(async ({ parsedInput: { id, ...data } }) => {
    const store = await prisma.store.update({
      where: {
        id,
      },
      data,
      select: {
        id: true,
      },
    })

    revalidatePath("/", "layout")

    return {
      store,
    }
  })

export const setStoreGoals = authActionClient
  .metadata({ actionName: "setStoreGoals" })
  .schema(setGoalsSchema)
  .action(async ({ parsedInput }) => {
    const store = await prisma.store.update({
      where: {
        id: parsedInput.storeId,
      },
      data: {
        salesGoalValue: parsedInput.salesGoalValue,
        ordersGoalValue: parsedInput.ordersGoalValue,
      },
      select: {
        id: true,
      },
    })

    revalidatePath(`/${store.id}/settings`)

    return {
      store,
    }
  })

export const createDiscount = authActionClient
  .metadata({ actionName: "createDiscount" })
  .schema(discountSchema)
  .action(async ({ parsedInput }) => {
    const discount = await prisma.discount.create({
      data: parsedInput,
      select: {
        id: true,
      },
    })

    revalidatePath(`/${parsedInput.storeId}/settings`)

    return {
      discount,
    }
  })
