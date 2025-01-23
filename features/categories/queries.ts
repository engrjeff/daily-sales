"use server"

import prisma from "@/lib/db"

import { checkIfOwnerOfStore } from "../store/queries"

export const getCategories = async (storeId: string) => {
  await checkIfOwnerOfStore(storeId)

  const categories = await prisma.category.findMany({
    where: {
      storeId,
    },
    include: {
      products: {
        select: { id: true },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  })

  return categories
}
