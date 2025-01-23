import * as z from "zod"

export const skuSchema = z.object({
  sku: z
    .string({ required_error: "SKU is required." })
    .min(1, { message: "SKU is required." }),
  price: z
    .number({
      required_error: "Price is required.",
      invalid_type_error: "Price is required.",
    })
    .positive({ message: "Must be greater than 0." }),
  costPrice: z
    .number({
      required_error: "Cost is required.",
      invalid_type_error: "Cost is required.",
    })
    .nonnegative({ message: "0 or more." }),
  stock: z
    .number({
      required_error: "Stock is required.",
      invalid_type_error: "Stock is required.",
    })
    .int({ message: "0 or more." })
    .nonnegative({ message: "0 or more." }),
  lowStockThreshold: z
    .number({ invalid_type_error: "0 or more." })
    .nonnegative({ message: "0 or more." })
    .default(0)
    .optional(),
})

export const attributeSchema = z.object({
  name: z
    .string({ required_error: "Variant name is required." })
    .min(1, { message: "Variant name is required." }),
  options: z
    .object({
      value: z
        .string({ required_error: "Option name is required." })
        .min(1, { message: "Option name is required." }),
    })
    .array()
    .min(2, { message: "Must have at least 2 options." })
    .superRefine((items, ctx) => {
      const uniqueItemsCount = new Set(
        items.map((item) => item.value.toLowerCase())
      ).size
      const errorPosition = items.length - 1

      if (uniqueItemsCount !== items.length) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Option already exists.",
          path: [errorPosition, "value"],
        })
      }
    }),
})

export const variantSkusSchema = z.object({
  name: z.string(),
  imageUrl: z.string().optional(),
  attribute: z.string(),
  skus: skuSchema
    .extend({ value: z.string() })
    .superRefine(({ price, costPrice }, ctx) => {
      if (price && costPrice && costPrice >= price) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Cost must be lower than price.",
          path: ["costPrice"],
        })
      }
    })
    .array()
    .optional(),
})

export const skuSchemaObject = z.object({
  type: z.literal("sku-only"),
  skuObject: skuSchema.superRefine(({ price, costPrice }, ctx) => {
    if (price && costPrice && costPrice >= price) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Cost must be lower than price.",
        path: ["costPrice"],
      })
    }
  }),
})

export const variantObjectSchema = z.object({
  type: z.literal("with-variants"),
  attributes: attributeSchema
    .array()
    .min(1, { message: "Must have at least one variant" })
    .superRefine((items, ctx) => {
      const uniqueItemsCount = new Set(
        items.map((item) => item.name.toLowerCase())
      ).size
      const errorPosition = items.length - 1

      if (uniqueItemsCount !== items.length) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Variant already exists.",
          path: [errorPosition, "name"],
        })
      }
    }),
  variants: skuSchema
    .extend({
      attr1: z.string(),
      attr2: z.string().optional(),
      imageUrl: z.string().optional(),
    })
    .superRefine(({ price, costPrice }, ctx) => {
      if (price && costPrice && costPrice >= price) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Cost must be lower than price.",
          path: ["costPrice"],
        })
      }
    })
    .array()
    .optional(),
})

export const productSchema = z.object({
  name: z
    .string({ required_error: "Name is required." })
    .min(1, { message: "Name is required." }),
  description: z
    .string({ required_error: "Description is required." })
    .min(1, { message: "Description is required." })
    .optional(),
  imageUrl: z.string().optional(),
  categoryId: z
    .string({ required_error: "Category is required." })
    .min(1, { message: "Category is required." }),
  meta: z.discriminatedUnion("type", [skuSchemaObject, variantObjectSchema]),
  mode: z.enum(["copy", "default"]).default("default"),
})

export const withStoreId = z.object({
  storeId: z.string({
    required_error: "A product should be associated with a store.",
  }),
})

export const requireProductId = z.object({
  id: z.string({
    required_error: "Product id is required.",
  }),
})

export const updateProductSchema = productSchema.extend({
  id: z.string({
    required_error: "Product id is required.",
  }),
  storeId: z.string({
    required_error: "A product should be associated with a store.",
  }),
})

export type CreateProductInputs = z.infer<typeof productSchema>

export type UpdateProductInputs = z.infer<typeof updateProductSchema>

export type VariantSkus = z.infer<typeof variantObjectSchema>["variants"]
