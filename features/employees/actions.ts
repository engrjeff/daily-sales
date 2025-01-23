"use server"

import { cookies } from "next/headers"
import bcrypt from "bcryptjs"

import prisma from "@/lib/db"
import { actionClient, authActionClient } from "@/lib/safe-action"
import { signEmployeeToken } from "@/lib/server"

import { employeeSchema, employeeSignInSchema } from "./schema"

export const createEmployeByInvite = actionClient
  .metadata({ actionName: "createEmployeByInvite" })
  .schema(employeeSchema)
  .action(async ({ parsedInput }) => {
    const store = await prisma.store.findUnique({
      where: {
        id: parsedInput.storeId,
      },
    })

    if (!store) {
      throw new Error("Invalid store.")
    }

    const hashedPin = await bcrypt.hash(parsedInput.pin, 10)

    const employee = await prisma.employee.create({
      data: {
        ...parsedInput,
        employerId: store.ownerId,
        pin: hashedPin,
      },
      select: {
        id: true,
      },
    })

    return {
      employee,
    }
  })

export const createEmployee = authActionClient
  .metadata({ actionName: "createEmployee" })
  .schema(employeeSchema)
  .action(async ({ parsedInput, ctx: { user } }) => {
    const hashedPin = await bcrypt.hash(parsedInput.pin, 10)

    const employee = await prisma.employee.create({
      data: {
        ...parsedInput,
        employerId: user.userId,
        pin: hashedPin,
      },
      select: {
        id: true,
      },
    })

    return {
      employee,
    }
  })

export const signInEmployee = actionClient
  .metadata({ actionName: "signInEmployee" })
  .schema(employeeSignInSchema)
  .action(async ({ parsedInput }) => {
    const employee = await prisma.employee.findFirst({
      where: {
        email: parsedInput.email,
        storeId: parsedInput.storeId,
      },
    })

    if (!employee) {
      throw new Error("Invalid email or PIN.")
    }

    const isValid = await bcrypt.compare(parsedInput.pin, employee.pin)

    if (!isValid) {
      throw new Error("Invalid email or PIN.")
    }

    // sign a jwt
    const token = signEmployeeToken(employee)

    cookies().set(process.env.DS_ES_TOKEN_KEY!, token)

    return {
      employee,
    }
  })

export const signOutEmployee = actionClient
  .metadata({ actionName: "signOutEmployee" })
  .action(async () => {
    cookies().delete(process.env.DS_ES_TOKEN_KEY!)

    return {
      success: true,
    }
  })
