import { EmployeeStatus } from "@prisma/client"
import * as z from "zod"

export const employeeSchema = z.object({
  storeId: z.string({
    required_error: "Store id is required.",
  }),
  name: z
    .string({ required_error: "Name is required." })
    .min(1, { message: "Name is required." }),
  avatarUrl: z
    .union([z.literal(""), z.string().trim().url({ message: "Invalid URL." })])
    .optional(),
  email: z
    .string({ required_error: "Email is required." })
    .email({ message: "Invalid email." }),
  username: z
    .string({ required_error: "Username is required." })
    .min(6, { message: "Must be at least 6 characters." }),
  contactNumber: z.string().optional(),
  pin: z
    .string({ required_error: "PIN is required." })
    .length(6, { message: "Must be exactly 6 characters" })
    .regex(/^[0-9]*$/, { message: "Must be composed of digits only." }), // should be hashed when sent to the server
  status: z.nativeEnum(EmployeeStatus).default(EmployeeStatus.ACTIVE),
})

export const employeeSignInSchema = z.object({
  storeId: z.string({
    required_error: "Store id is required.",
  }),
  email: z
    .string({ required_error: "Email is required." })
    .email({ message: "Invalid email." }),
  pin: z.string({ required_error: "PIN is required." }),
})

export type EmployeeInputs = z.infer<typeof employeeSchema>

export type EmployeeSignInInputs = z.infer<typeof employeeSignInSchema>
