"use server"

import prisma from "@/lib/db"

import { checkIfOwnerOfStore } from "../store/queries"

export const getEmployees = async (storeId: string) => {
  await checkIfOwnerOfStore(storeId)

  const employees = await prisma.employee.findMany({
    where: {
      storeId,
    },
    orderBy: {
      createdAt: "desc",
    },
  })

  return employees
}
