import { cookies } from "next/headers"
import { Employee } from "@prisma/client"
import jwt from "jsonwebtoken"

import prisma from "./db"

export function signEmployeeToken(employee: Employee) {
  const token = jwt.sign(employee, process.env.ES_JWT_SECRET!, {
    expiresIn: "1d",
  })

  return token
}

export async function verifyEmployeeToken() {
  const token = cookies().get(process.env.DS_ES_TOKEN_KEY!)

  if (!token?.value) return null

  try {
    const decoded = jwt.verify(
      token.value,
      process.env.ES_JWT_SECRET!
    ) as Employee

    if (!decoded?.id) return null

    // find the actual employe
    const employee = await prisma.employee.findUnique({
      where: { id: decoded.id },
    })

    return employee
  } catch {
    return null
  }
}
