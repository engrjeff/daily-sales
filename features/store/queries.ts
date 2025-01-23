"use server"

import { notFound, redirect } from "next/navigation"
import { auth } from "@clerk/nextjs/server"

import prisma from "@/lib/db"

export const getStores = async () => {
  const user = await auth()

  if (!user?.userId) return []

  const stores = await prisma.store.findMany({
    where: {
      ownerId: user.userId!,
    },
    orderBy: {
      createdAt: "desc",
    },
  })

  return stores
}

export const getStoreById = async (storeId: string) => {
  await checkIfOwnerOfStore(storeId)

  const store = await prisma.store.findUnique({
    where: {
      id: storeId,
    },
  })

  return store
}

export const getStoreByIdExternal = async (storeId: string) => {
  const store = await prisma.store.findUnique({
    where: {
      id: storeId,
    },
  })

  return store
}

export const getDiscounts = async (storeId: string) => {
  await checkIfOwnerOfStore(storeId)

  const discounts = await prisma.discount.findMany({
    where: {
      storeId,
    },
    orderBy: {
      createdAt: "desc",
    },
  })

  return discounts
}

export async function checkIfOwnerOfStore(storeId: string) {
  const user = await auth()

  if (!user?.userId) redirect("/sign-in")

  const foundStore = await prisma.store.findUnique({
    where: {
      id: storeId,
      ownerId: user.userId!,
    },
  })

  if (!foundStore) return notFound()

  return true
}
