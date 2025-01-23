"use client"

import { Fragment, useEffect } from "react"
import Link from "next/link"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  ArrowLeftIcon,
  GripVerticalIcon,
  PlusIcon,
  RotateCwIcon,
  TrashIcon,
} from "lucide-react"
import { useAction } from "next-safe-action/hooks"
import {
  SubmitErrorHandler,
  SubmitHandler,
  useFieldArray,
  useForm,
  useFormContext,
  useWatch,
} from "react-hook-form"
import { toast } from "sonner"

import { cn, formatDate } from "@/lib/utils"
import { Button, buttonVariants } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { ImageInput } from "@/components/ui/image-input"
import { Input } from "@/components/ui/input"
import { NumberInput } from "@/components/ui/number-input"
import { Separator } from "@/components/ui/separator"
import { SubmitButton } from "@/components/ui/submit-button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"
import { CategorySelect } from "@/components/category-select"

import { updateProduct } from "./actions"
import { generateSku } from "./helpers"
import {
  CreateProductInputs,
  UpdateProductInputs,
  updateProductSchema,
} from "./schema"

export function ProductEditForm({
  storeId,
  initialValues,
  lastUpdated,
}: {
  storeId: string
  initialValues: UpdateProductInputs
  lastUpdated: Date
}) {
  const form = useForm<UpdateProductInputs>({
    resolver: zodResolver(updateProductSchema),
    mode: "onChange",
    defaultValues: initialValues,
  })

  const hasNoChanges = !form.formState.isDirty
  useEffect(() => {
    if (form.formState.isSubmitSuccessful) {
      form.reset(initialValues)
    }
  }, [form, initialValues])

  useEffect(() => {
    function callback(e: BeforeUnloadEvent) {
      e.preventDefault()
    }

    if (!hasNoChanges) {
      window.addEventListener("beforeunload", callback)
    } else {
      window.removeEventListener("beforeunload", callback)
    }

    return () => {
      window.removeEventListener("beforeunload", callback)
    }
  }, [hasNoChanges])

  const metaType = form.watch("meta.type")

  const action = useAction(updateProduct, {
    onError: ({ error }) => {
      if (error.serverError === "Cannot have products with the same name.") {
        form.setError("name", { message: error.serverError })

        toast.error("The store was not created. Please try again.")

        form.setFocus("name")

        return
      }
      if (
        error.serverError === "Cannot have duplicate SKUs for the same store."
      ) {
        toast.error(error.serverError)

        if (metaType === "sku-only") {
          form.setError("meta.skuObject.sku", { message: error.serverError })

          form.setFocus("meta.skuObject.sku")
        }

        return
      }

      toast.error(
        error.serverError ?? "The store was not updated. Please try again."
      )
    },
  })

  const onError: SubmitErrorHandler<UpdateProductInputs> = (errors) => {
    console.log(errors)
  }

  const onSubmit: SubmitHandler<UpdateProductInputs> = async (values) => {
    // console.log(initialValues.meta, values.meta)
    // return

    const result = await action.executeAsync({
      ...values,
      storeId,
    })

    if (result?.data?.product?.id) {
      toast.success("Product updated!")
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit, onError)}
        onChange={() => form.clearErrors()}
        className={cn(
          "max-w-full space-y-4 overflow-hidden px-1",
          action.isPending ? "pointer-events-none" : ""
        )}
      >
        <div className="flex justify-between">
          <div className="flex items-start gap-2">
            <Link
              href={`/${storeId}/products`}
              aria-label="Go back to product list"
              className="hover:bg-secondary inline-flex size-8 items-center justify-center rounded-md"
            >
              <ArrowLeftIcon className="size-4" aria-hidden={true} />
            </Link>
            <div>
              <h1 className="font-semibold">{initialValues.name}</h1>
              <p className="text-muted-foreground text-sm">
                Last updated on {formatDate(lastUpdated)}
              </p>
            </div>
          </div>
          <div className="flex items-center justify-end gap-4">
            <Link
              href={`/${storeId}/products`}
              className={buttonVariants({ size: "sm", variant: "secondary" })}
            >
              Discard
            </Link>
            <SubmitButton
              size="sm"
              type="submit"
              loading={action.isPending}
              disabled={hasNoChanges}
            >
              Update Product
            </SubmitButton>
          </div>
        </div>

        <Separator />

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[200px,1fr] lg:gap-20">
          <div>
            <p className="font-semibold">Basic Information</p>
            <p className="text-muted-foreground text-sm">
              Common info for this product.
            </p>
          </div>
          <fieldset className="space-y-3">
            <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem className="max-w-sm">
                  <FormLabel>Image</FormLabel>
                  <FormControl>
                    <ImageInput
                      className="size-20"
                      urlValue={field.value}
                      onValueChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Product name"
                      autoFocus={true}
                      className="bg-muted border-border"
                      {...field}
                      onChange={(e) => {
                        if (metaType === "sku-only") {
                          const name = e.currentTarget.value

                          const skuValue = generateSku(name)

                          form.setValue("meta.skuObject.sku", skuValue)
                        }

                        field.onChange(e)
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Product description"
                      className="bg-muted border-border"
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <FormControl>
                    <CategorySelect
                      selectedCategoryId={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </fieldset>

          <div>
            <p className="font-semibold">Pricing & Variants</p>
            <p className="text-muted-foreground text-sm">
              This is where product pricing & variants are defined.
            </p>
          </div>

          <div>
            {metaType === "sku-only" ? (
              <fieldset className="space-y-3">
                <p className="font-semibold">Pricing & SKU</p>
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="meta.skuObject.sku"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>SKU</FormLabel>
                        <div className="relative md:w-3/4">
                          <FormControl>
                            <Input
                              placeholder="SKU"
                              className="bg-muted border-border"
                              {...field}
                            />
                          </FormControl>
                          <Button
                            type="button"
                            size="icon"
                            variant="secondary"
                            className="absolute inset-y-1 end-1 size-7 disabled:cursor-not-allowed"
                            title="click to generate SKU"
                            onClick={(e) => {
                              e.stopPropagation()
                              const skuValue = generateSku(form.watch("name"))
                              form.setValue("meta.skuObject.sku", skuValue)
                            }}
                          >
                            <span className="sr-only">generate sku</span>
                            <RotateCwIcon className="size-4" />
                          </Button>
                        </div>
                        <FormDescription>Stock Keeping Unit</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid w-3/4 grid-cols-1 gap-4 lg:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="meta.skuObject.price"
                      render={() => (
                        <FormItem>
                          <FormLabel>Price</FormLabel>
                          <FormControl>
                            <NumberInput
                              currency="₱"
                              placeholder="0.00"
                              className="bg-muted border-border"
                              min={0}
                              {...form.register("meta.skuObject.price", {
                                valueAsNumber: true,
                              })}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="meta.skuObject.costPrice"
                      render={() => (
                        <FormItem>
                          <FormLabel>Cost Price</FormLabel>
                          <FormControl>
                            <NumberInput
                              currency="₱"
                              placeholder="0.00"
                              className="bg-muted border-border"
                              min={0}
                              {...form.register("meta.skuObject.costPrice", {
                                valueAsNumber: true,
                              })}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="meta.skuObject.stock"
                      render={() => (
                        <FormItem>
                          <FormLabel>Stock</FormLabel>
                          <FormControl>
                            <NumberInput
                              placeholder="0"
                              min={0}
                              className="bg-muted border-border"
                              {...form.register("meta.skuObject.stock", {
                                valueAsNumber: true,
                              })}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="meta.skuObject.lowStockThreshold"
                      render={() => (
                        <FormItem>
                          <FormLabel>Low Stock Threshold</FormLabel>
                          <FormControl>
                            <NumberInput
                              placeholder="0"
                              min={0}
                              className="bg-muted border-border"
                              {...form.register(
                                "meta.skuObject.lowStockThreshold",
                                {
                                  valueAsNumber: true,
                                }
                              )}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </fieldset>
            ) : (
              <AttributeFields />
            )}
          </div>
        </div>

        {metaType === "sku-only" ? null : (
          <VariantSkusFields
            key={
              JSON.stringify(form.watch("meta.attributes")) +
              "-" +
              form.watch("name")
            }
          />
        )}

        <div className="flex items-center justify-end gap-4 pt-6">
          <Link
            href={`/${storeId}/products`}
            className={buttonVariants({ size: "sm", variant: "secondary" })}
          >
            Discard
          </Link>
          <SubmitButton
            size="sm"
            type="submit"
            loading={action.isPending}
            disabled={hasNoChanges}
          >
            Update Product
          </SubmitButton>
        </div>
      </form>
    </Form>
  )
}

function AttributeFields() {
  const form = useFormContext<CreateProductInputs>()

  const attributes = useFieldArray({
    control: form.control,
    name: "meta.attributes",
  })

  const variants = useWatch({ control: form.control, name: "meta.variants" })

  const variantFields = useFieldArray({
    control: form.control,
    name: "meta.variants",
  })

  async function addAttribute() {
    const isValidSoFar = await form.trigger(
      `meta.attributes.${attributes.fields.length - 1}`,
      { shouldFocus: true }
    )

    if (!isValidSoFar) return

    attributes.append({ name: "", options: [{ value: "" }] })
  }

  function deleteAttribute(attrIndex: number) {
    // find variants with this attr
    const thisAttribute = form.getValues(`meta.attributes.${attrIndex}`)

    if (attrIndex === 0) {
      const affectedVariantIndexes = variants
        ?.map((v, i) => ({ index: i, v }))
        .filter((v) =>
          thisAttribute.options.map((o) => o.value).includes(v.v.attr1)
        )
        .map((d) => d.index)

      variantFields.remove(affectedVariantIndexes)
    } else if (attrIndex === 1) {
      const affectedVariantIndexes = variants
        ?.map((v, i) => ({ index: i, v }))
        .filter((v) =>
          thisAttribute.options.map((o) => o.value).includes(v.v.attr2!)
        )
        .map((d) => d.index)

      variantFields.remove(affectedVariantIndexes)
    }

    attributes.remove(attrIndex)
  }
  return (
    <fieldset className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="font-semibold">Attributes</p>
        {attributes.fields.length < 2 ? (
          <Button
            type="button"
            size="sm"
            variant="ghost"
            className="text-blue-500"
            onClick={addAttribute}
          >
            <PlusIcon /> Add Attribute
          </Button>
        ) : null}
      </div>
      {attributes.fields.map((attribute, attrIndex) => (
        <ul key={`attribute-${attribute.id}`}>
          <li className="pr-1">
            <FormField
              control={form.control}
              name={`meta.attributes.${attrIndex}.name`}
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between">
                    <FormLabel>Attribute Name</FormLabel>
                    <Button
                      type="button"
                      size="sm"
                      variant="link"
                      aria-label="remove variant"
                      className="text-red-500"
                      disabled={attributes.fields.length === 1}
                      onClick={() => deleteAttribute(attrIndex)}
                    >
                      Delete
                    </Button>
                  </div>
                  <FormControl>
                    <Input
                      list="common-attribute-names"
                      placeholder="Attribute name"
                      className="bg-muted border-border"
                      {...field}
                      autoFocus={true}
                    />
                  </FormControl>
                  <datalist id="common-attribute-names">
                    <option value="Color"></option>
                    <option value="Size"></option>
                    <option value="Material"></option>
                  </datalist>
                  <FormMessage />
                </FormItem>
              )}
            />
            <AttributeOptionsFields attrIndex={attrIndex} />
          </li>
        </ul>
      ))}
    </fieldset>
  )
}

function AttributeOptionsFields({ attrIndex }: { attrIndex: number }) {
  const form = useFormContext<CreateProductInputs>()

  const variants = useWatch({ control: form.control, name: "meta.variants" })

  const attributeValues = useFieldArray({
    control: form.control,
    name: `meta.attributes.${attrIndex}.options`,
  })

  const variantFields = useFieldArray({
    control: form.control,
    name: "meta.variants",
  })

  const errors = form.getFieldState(`meta.attributes.${attrIndex}.options`)

  const rootErr = errors.error?.root?.message

  function deleteOption(optionIndex: number) {
    const thisOption = form.getValues(
      `meta.attributes.${attrIndex}.options.${optionIndex}.value`
    )

    if (attrIndex === 0) {
      const affectedVariantIndexes = variants
        ?.map((v, i) => ({ index: i, v }))
        .filter((v) => v.v.attr1 === thisOption)
        .map((d) => d.index)

      variantFields.remove(affectedVariantIndexes)
    } else if (attrIndex === 1) {
      const affectedVariantIndexes = variants
        ?.map((v, i) => ({ index: i, v }))
        .filter((v) => v.v.attr2 === thisOption)
        .map((d) => d.index)

      variantFields.remove(affectedVariantIndexes)
    }

    attributeValues.remove(optionIndex)
  }

  async function addOption() {
    const isValidSoFar = await form.trigger(
      `meta.attributes.${attrIndex}.options.${
        attributeValues.fields.length - 1
      }`,
      { shouldFocus: true }
    )

    if (!isValidSoFar) return

    if (attrIndex === 1) {
      const attr1Options = form.getValues(`meta.attributes.0.options`)

      attr1Options.forEach((attr, outerIndex) => {
        const insertIndex =
          (attributeValues.fields.length + 1) * outerIndex +
          attributeValues.fields.length

        variantFields.insert(insertIndex, {
          attr1: attr.value,
          attr2: "",
          sku: "",
          price: 0,
          costPrice: 0,
          stock: 0,
          lowStockThreshold: 0,
          imageUrl: undefined,
        })
      })
    }

    attributeValues.append({ value: "" })
  }

  return (
    <ul className="ml-3 space-y-2 border-l border-dashed py-4 pl-3">
      <li>
        <p className="text-sm">
          Options{" "}
          {rootErr ? (
            <span className="text-destructive text-xs">{rootErr}</span>
          ) : null}
        </p>
      </li>
      {attributeValues.fields.map((option, optionIndex) => (
        <li key={`${option.id}-${option.value}-${optionIndex + 1}`}>
          <AttributeOptionItem
            attributeIndex={attrIndex}
            optionIndex={optionIndex}
            disabledDelete={attributeValues.fields.length === 1}
            onDeleteClick={() => deleteOption(optionIndex)}
          />
        </li>
      ))}
      <li className="pt-4">
        <Button type="button" size="sm" variant="secondary" onClick={addOption}>
          <PlusIcon /> Add Option
        </Button>
      </li>
    </ul>
  )
}

function AttributeOptionItem({
  attributeIndex,
  optionIndex,
  disabledDelete,
  onDeleteClick,
}: {
  attributeIndex: number
  optionIndex: number
  disabledDelete?: boolean
  onDeleteClick?: () => void
}) {
  const form = useFormContext<CreateProductInputs>()

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        aria-label="drag to reorder"
        className="cursor-grab"
        disabled
      >
        <GripVerticalIcon size={16} className="size-4" />
      </button>
      <FormField
        control={form.control}
        name={`meta.attributes.${attributeIndex}.options.${optionIndex}.value`}
        render={({ field }) => (
          <FormItem className="flex-1 space-y-0">
            <FormLabel className="sr-only">Option Name</FormLabel>
            <FormControl>
              <div className="relative">
                <Input
                  placeholder="Small"
                  className="bg-muted border-border"
                  {...field}
                />
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  className="absolute inset-y-1 end-1 size-7 disabled:cursor-not-allowed"
                  aria-label="delete"
                  disabled={disabledDelete}
                  onClick={onDeleteClick}
                  tabIndex={-1}
                >
                  <TrashIcon size={16} strokeWidth={2} aria-hidden="true" />
                </Button>
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
}

function VariantSkusFields() {
  const form = useFormContext<CreateProductInputs>()

  const attributes = useWatch({
    control: form.control,
    name: "meta.attributes",
  })

  const productName = useWatch({
    control: form.control,
    name: "name",
  })

  const variants = useFieldArray({
    control: form.control,
    name: "meta.variants",
  })

  const validAttributes = attributes
    ?.filter(
      (attr) => Boolean(attr.name) && attr.options.filter((o) => o.value).length
    )
    .map((a) => ({ name: a.name, options: a.options.filter((v) => v.value) }))

  useEffect(() => {
    if (validAttributes?.length === 1) {
      validAttributes[0].options.forEach((attr1, index) => {
        const currentVal = form.getValues(`meta.variants.${index}`)

        variants.update(index, {
          attr1: attr1.value,
          attr2: "",
          sku: generateSku(productName, attr1.value),
          price: currentVal?.price ?? 0,
          costPrice: currentVal?.costPrice ?? 0,
          stock: currentVal?.stock ?? 0,
          lowStockThreshold: currentVal?.lowStockThreshold ?? 0,
          imageUrl: currentVal?.imageUrl ?? undefined,
        })
      })
    } else if (validAttributes?.length === 2) {
      validAttributes[0].options.forEach((attr1, outerIndex) => {
        validAttributes[1].options.forEach((attr2, innerIndex, arr2) => {
          const targetIndex = arr2.length * outerIndex + innerIndex

          const currentVal = form.getValues(`meta.variants.${targetIndex}`)

          variants.update(targetIndex, {
            attr1: attr1.value,
            attr2: attr2.value,
            sku: generateSku(productName, attr1.value, attr2.value),
            price: currentVal?.price ?? 0,
            costPrice: currentVal?.costPrice ?? 0,
            stock: currentVal?.stock ?? 0,
            lowStockThreshold: currentVal?.lowStockThreshold ?? 0,
            imageUrl: currentVal?.imageUrl ?? undefined,
          })
        })
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [attributes, productName])

  if (!validAttributes?.length) return null

  if (!variants?.fields?.length) return null

  return (
    <>
      <p className="mb-3 font-semibold">Variants</p>
      <Table
        containerClass="border bg-muted/30 rounded-lg w-full h-auto"
        className="mb-0"
      >
        <TableHeader>
          <TableRow className="bg-muted/30 hover:bg-muted/30">
            <TableHead className="w-[80px] border-r text-center">
              {validAttributes[0].name}
            </TableHead>
            {validAttributes[1]?.name && (
              <TableHead className="w-[80px] border-r text-center">
                {validAttributes[1].name}
              </TableHead>
            )}
            <TableHead className="w-[110px] min-w-[110px] border-r lg:min-w-0">
              Price
            </TableHead>
            <TableHead className="w-[110px] min-w-[110px] border-r lg:min-w-0">
              Cost
            </TableHead>
            <TableHead className="w-[110px] min-w-[110px] border-r lg:min-w-0">
              Stock
            </TableHead>
            <TableHead className="w-[110px] min-w-[110px] border-r lg:min-w-0">
              Low Stock At
            </TableHead>
            <TableHead className="w-[180px] min-w-[180px] max-w-[220px]">
              SKU
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {validAttributes.at(1)?.options.length
            ? variants.fields?.map((variant, varIndex) => {
                const attr2OptionsLen =
                  validAttributes.at(1)?.options?.length ?? 0

                return (
                  <Fragment key={`variant-item-${variant.sku}-${varIndex}`}>
                    <TableRow className="hover:bg-transparent">
                      {varIndex % attr2OptionsLen === 0 ? (
                        <TableCell
                          className="border-r text-center"
                          rowSpan={attr2OptionsLen}
                        >
                          <div className="flex flex-col items-center justify-center gap-2">
                            <span>{variant.attr1}</span>
                            <FormField
                              control={form.control}
                              name={`meta.variants.${varIndex}.imageUrl`}
                              render={({ field }) => (
                                <FormItem className="flex max-w-sm flex-col items-center justify-center">
                                  <FormControl>
                                    <ImageInput
                                      urlValue={field.value}
                                      onValueChange={field.onChange}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </TableCell>
                      ) : null}

                      <TableCell className="border-r text-center">
                        {variant.attr2}
                      </TableCell>
                      <VariantFields variantItemIndex={varIndex} />
                    </TableRow>
                  </Fragment>
                )
              })
            : variants.fields?.map((variant, varIndex) => (
                <Fragment key={`variant-item-${variant.attr1}-${varIndex}`}>
                  <TableRow className="hover:bg-transparent">
                    <TableCell className="border-r text-center">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <span>{variant.attr1}</span>
                        <FormField
                          control={form.control}
                          name={`meta.variants.${varIndex}.imageUrl`}
                          render={({ field }) => (
                            <FormItem className="flex max-w-sm flex-col items-center justify-center">
                              <FormControl>
                                <ImageInput
                                  urlValue={field.value}
                                  onValueChange={field.onChange}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </TableCell>
                    <VariantFields variantItemIndex={varIndex} />
                  </TableRow>
                </Fragment>
              ))}
        </TableBody>
      </Table>
    </>
  )
}

function VariantFields({ variantItemIndex }: { variantItemIndex: number }) {
  const form = useFormContext<CreateProductInputs>()

  return (
    <>
      <TableCell className="border-r align-top">
        <FormField
          control={form.control}
          name={`meta.variants.${variantItemIndex}.price`}
          render={() => (
            <FormItem>
              <FormControl>
                <NumberInput
                  aria-label="price"
                  currency="₱"
                  placeholder="0.00"
                  className="bg-muted border-border"
                  min={0}
                  {...form.register(`meta.variants.${variantItemIndex}.price`, {
                    valueAsNumber: true,
                  })}
                />
              </FormControl>
              <FormMessage className="text-wrap" />
            </FormItem>
          )}
        />
      </TableCell>
      <TableCell className="border-r align-top">
        <FormField
          control={form.control}
          name={`meta.variants.${variantItemIndex}.costPrice`}
          render={() => (
            <FormItem>
              <FormControl>
                <NumberInput
                  aria-label="cost price"
                  currency="₱"
                  placeholder="0.00"
                  className="bg-muted border-border"
                  min={0}
                  {...form.register(
                    `meta.variants.${variantItemIndex}.costPrice`,
                    {
                      valueAsNumber: true,
                    }
                  )}
                />
              </FormControl>
              <FormMessage className="text-wrap" />
            </FormItem>
          )}
        />
      </TableCell>
      <TableCell className="border-r align-top">
        <FormField
          control={form.control}
          name={`meta.variants.${variantItemIndex}.stock`}
          render={() => (
            <FormItem>
              <FormControl>
                <NumberInput
                  aria-label="stock"
                  placeholder="0"
                  min={0}
                  className="bg-muted border-border"
                  noDecimal
                  {...form.register(`meta.variants.${variantItemIndex}.stock`, {
                    valueAsNumber: true,
                  })}
                />
              </FormControl>
              <FormMessage className="text-wrap" />
            </FormItem>
          )}
        />
      </TableCell>

      <TableCell className="border-r align-top">
        <FormField
          control={form.control}
          name={`meta.variants.${variantItemIndex}.lowStockThreshold`}
          render={() => (
            <FormItem>
              <FormControl>
                <NumberInput
                  aria-label="low stock threshold"
                  placeholder="0"
                  min={0}
                  className="bg-muted border-border"
                  noDecimal
                  {...form.register(
                    `meta.variants.${variantItemIndex}.lowStockThreshold`,
                    {
                      valueAsNumber: true,
                    }
                  )}
                />
              </FormControl>
              <FormMessage className="text-wrap" />
            </FormItem>
          )}
        />
      </TableCell>

      <TableCell className="align-top">
        <FormField
          control={form.control}
          name={`meta.variants.${variantItemIndex}.sku`}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  aria-label="sku"
                  placeholder="SKU"
                  className="bg-muted border-border"
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-wrap" />
            </FormItem>
          )}
        />
      </TableCell>
    </>
  )
}
