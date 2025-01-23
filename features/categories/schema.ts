import * as z from "zod"

export const categorySchema = z.object({
  storeId: z.string({
    required_error: "Store id is required.",
  }),
  name: z
    .string({ required_error: "Name is required." })
    .min(1, { message: "Name is required." }),
})

export const withCategoryId = z.object({
  id: z.string({
    required_error: "Category id is required.",
  }),
})

export const updateCategorySchema = categorySchema.merge(withCategoryId)

export type CategoryInputs = z.infer<typeof categorySchema>
