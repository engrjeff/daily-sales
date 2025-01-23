"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Category } from "@prisma/client"
import { useAction } from "next-safe-action/hooks"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { SubmitButton } from "@/components/ui/submit-button"

import { useStoreId } from "../store/hooks"
import { updateCategory } from "./actions"
import { CategoryInputs, categorySchema } from "./schema"

export function CategoryEditForm({ category }: { category: Category }) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="link" className="text-blue-500">
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent
        className="sm:max-w-[425px]"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>Update {category.name}</DialogTitle>
          <DialogDescription>Save your changes once done.</DialogDescription>
        </DialogHeader>
        <CategoryFormComponent
          category={category}
          onAfterSave={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  )
}

function CategoryFormComponent({
  onAfterSave,
  category,
}: {
  onAfterSave: () => void
  category: Category
}) {
  const storeId = useStoreId()

  const form = useForm<CategoryInputs>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      storeId,
      name: category.name,
    },
  })

  const action = useAction(updateCategory, {
    onError: ({ error }) => {
      if (error.serverError === "Cannot have products with the same name.") {
        form.setFocus("name")

        form.setError("name", { message: "This already exists." })

        return
      }
      toast.error(
        error.serverError ?? "The category was not updated. Please try again."
      )
    },
  })

  function onError(errors: typeof form.formState.errors) {
    console.log(errors)
  }

  async function onSubmit(values: CategoryInputs) {
    const result = await action.executeAsync({
      id: category.id,
      ...values,
    })

    if (result?.data?.category?.id) {
      toast.success("Category saved!")

      onAfterSave()
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit, onError)} autoComplete="off">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category name</FormLabel>
              <FormControl>
                <Input placeholder="Untitled category" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <DialogClose asChild>
            <Button type="button" variant="ghost" disabled={action.isPending}>
              Cancel
            </Button>
          </DialogClose>
          <SubmitButton type="submit" loading={action.isPending}>
            Save Changes
          </SubmitButton>
        </div>
      </form>
    </Form>
  )
}
