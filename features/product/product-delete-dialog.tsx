'use client';

import { useAction } from 'next-safe-action/hooks';
import React from 'react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { SubmitButton } from '@/components/ui/submit-button';
import { toast } from 'sonner';
import { deleteProduct } from './actions';

export function ProductDeleteDialog({
  productName,
  productId,
  ...dialogProps
}: React.ComponentProps<typeof Dialog> & {
  productName: string;
  productId: string;
}) {
  const action = useAction(deleteProduct, {
    onError({ error }) {
      toast.error(
        error.serverError ?? 'The product was not deleted. Please try again.'
      );
    },
    onSuccess() {
      toast.success('The product was deleted successfully!');
    },
  });

  const handleDelete = async () => {
    const result = await action.executeAsync({ id: productId });
    if (result?.data?.status === 'ok') {
      if (dialogProps.onOpenChange) {
        dialogProps.onOpenChange(false);
      }
    }
  };
  return (
    <Dialog {...dialogProps}>
      <DialogContent className="rounded-lg">
        <DialogHeader className="text-left">
          <DialogTitle>Delete</DialogTitle>
          <DialogDescription>
            Do you really want to delete{' '}
            <span className="font-semibold text-red-500">{productName}</span>?
            This action cannot be undone. This will permanently delete this
            record.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex-row justify-end space-x-2">
          <DialogClose disabled={action.isPending} asChild>
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </DialogClose>
          <SubmitButton
            type="button"
            variant="destructive"
            loading={action.isPending}
            onClick={handleDelete}
          >
            Confirm
          </SubmitButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
