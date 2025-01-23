import * as z from "zod"

export const createStoreSchema = z.object({
  name: z
    .string({ required_error: "Store name is required." })
    .min(1, { message: "Store name is required." }),
  description: z
    .string({ required_error: "Description is required." })
    .min(1, { message: "Description is required." }),
  address: z
    .string({ required_error: "Address is required." })
    .min(1, { message: "Address is required." }),
  logoUrl: z
    .union([z.literal(""), z.string().trim().url({ message: "Invalid logo." })])
    .optional(),
  color: z.string().optional(),
  website: z
    .union([
      z.literal(""),
      z.string().trim().url({ message: "Invalid website URL." }),
    ])
    .optional(),
  email: z
    .union([
      z.literal(""),
      z.string().trim().email({ message: "Invalid email." }),
    ])
    .optional(),

  contactNumber: z.string().optional(),

  categories: z
    .array(z.string())
    .min(1, { message: "Select at least one category." }),
})

export const updateStoreSchema = createStoreSchema
  .extend({
    id: z.string({ required_error: "Store ID is required." }),
  })
  .omit({ categories: true })

export const setGoalsSchema = z.object({
  storeId: z.string({ required_error: "Store ID is required." }),
  salesGoalValue: z.number().nonnegative(),
  ordersGoalValue: z.number().nonnegative(),
})

export type SetGoalsInputs = z.infer<typeof setGoalsSchema>

export type CreateStoreInputs = z.infer<typeof createStoreSchema>

export const discountSchema = z.object({
  storeId: z.string({ required_error: "Store ID is required" }),
  discountCode: z
    .string({ required_error: "Discount code is required." })
    .min(1, { message: "Discount code is required." })
    .min(3, { message: "Discount code too short." }),
  discountAmount: z
    .number({ required_error: "Discount amount is required." })
    .positive({ message: "Should be greater than 0" }),
  isValid: z.boolean(),
})

export type DiscountInputs = z.infer<typeof discountSchema>
