"use client"

import { useAction } from "next-safe-action/hooks"
import { toast } from "sonner"

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { SubmitButton } from "@/components/ui/submit-button"

import { deleteCategory } from "./actions"

export function CategoryDeleteDialog({
  open,
  setOpen,
  categoryId,
  categoryName,
}: {
  categoryId: string
  categoryName: string
  open: boolean
  setOpen: (state: boolean) => void
}) {
  const action = useAction(deleteCategory, {
    onError({ error }) {
      toast.error(
        error.serverError ?? "The category was not deleted. Please try again."
      )
    },
    onSuccess() {
      toast.success("The category was deleted successfully!")
    },
  })

  const handleDelete = async () => {
    const result = await action.executeAsync({ id: categoryId })
    if (result?.data?.status === "ok") {
      setOpen(false)
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete <br />
            <span className="text-foreground text-center font-medium">
              {categoryName}
            </span>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <SubmitButton
            type="button"
            variant="destructive"
            onClick={handleDelete}
            loading={action.isPending}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Continue
          </SubmitButton>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
