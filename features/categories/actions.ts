"use server"

import { revalidatePath } from "next/cache"

import prisma from "@/lib/db"
import { authActionClient } from "@/lib/safe-action"

import { categorySchema, updateCategorySchema, withCategoryId } from "./schema"

export const createCategory = authActionClient
  .metadata({ actionName: "createCategory" })
  .schema(categorySchema)
  .action(async ({ parsedInput }) => {
    const category = await prisma.category.create({
      data: parsedInput,
      select: {
        id: true,
      },
    })

    revalidatePath(`/${parsedInput.storeId}/categories`)

    return {
      category,
    }
  })

export const updateCategory = authActionClient
  .metadata({ actionName: "updateCategory" })
  .schema(updateCategorySchema)
  .action(async ({ parsedInput }) => {
    const category = await prisma.category.update({
      where: {
        id: parsedInput.id,
      },
      data: {
        name: parsedInput.name,
      },
      select: {
        id: true,
      },
    })

    revalidatePath(`/${parsedInput.storeId}/categories`)

    return {
      category,
    }
  })

export const deleteCategory = authActionClient
  .metadata({ actionName: "deleteCategory" })
  .schema(withCategoryId)
  .action(async ({ parsedInput: { id } }) => {
    const foundCat = await prisma.category.findFirst({
      where: { id },
      include: { _count: { select: { products: true } } },
    })

    if (!foundCat) throw new Error("Cannot find category.")

    if (foundCat._count.products)
      throw new Error(
        "The category cannot be deleted for there are products assigned to it. Reassigned the assigned products first."
      )

    await prisma.category.delete({
      where: {
        id,
      },
    })

    revalidatePath(`/${foundCat.storeId}/categories`)

    return {
      status: "ok",
    }
  })
