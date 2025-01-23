'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { SubmitButton } from '@/components/ui/submit-button';
import { Switch } from '@/components/ui/switch';

import { NumberInput } from '@/components/ui/number-input';
import { DiscountInputs, discountSchema } from '@/features/store/schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { PlusCircleIcon } from 'lucide-react';
import { useAction } from 'next-safe-action/hooks';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { createDiscount } from '../store/actions';
import { useStoreId } from '../store/hooks';

export function DiscountForm() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <PlusCircleIcon /> Add Code
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>New Discount Code</DialogTitle>
          <DialogDescription>Fill in the form below.</DialogDescription>
        </DialogHeader>
        <FormComponent onAfterSave={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}

function FormComponent({ onAfterSave }: { onAfterSave: () => void }) {
  const storeId = useStoreId();

  const form = useForm<DiscountInputs>({
    mode: 'onSubmit',
    resolver: zodResolver(discountSchema),
    defaultValues: {
      storeId,
      discountCode: '',
      discountAmount: 0,
      isValid: true,
    },
  });

  const action = useAction(createDiscount, {
    onError: ({ error }) => {
      toast.error(
        error.serverError ??
          'An error occured in saving the discount. Please try again.'
      );
    },
  });

  function onError(errors: typeof form.formState.errors) {
    console.log(errors);
  }

  async function onSubmit(values: DiscountInputs) {
    const result = await action.executeAsync(values);

    if (result?.data?.discount?.id) {
      toast.success('Discount code saved!');

      onAfterSave();
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit, onError)}
        className="max-w-sm"
      >
        <fieldset
          className="space-y-3 disabled:cursor-not-allowed disabled:opacity-90"
          disabled={action.isPending}
        >
          <FormField
            control={form.control}
            name="discountCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Code</FormLabel>
                <FormControl>
                  <Input
                    placeholder="CODE"
                    className="bg-muted border-border"
                    {...field}
                  />
                </FormControl>
                <FormDescription>Example: PROMO50</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="discountAmount"
            render={() => (
              <FormItem>
                <FormLabel>Amount</FormLabel>
                <FormControl>
                  <NumberInput
                    placeholder="0.00"
                    prefix="Php"
                    className="bg-muted border-border"
                    {...form.register('discountAmount', {
                      valueAsNumber: true,
                    })}
                  />
                </FormControl>
                <FormDescription>
                  The amount to be deducted from the regular order total.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="isValid"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between">
                <div className="space-y-0.5">
                  <FormLabel>Is Active?</FormLabel>
                  <FormDescription>
                    Enable this to be effective.
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    className="bg-border border"
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <div className="flex justify-end pt-6">
            <SubmitButton type="submit" size="sm" loading={action.isPending}>
              Save Code
            </SubmitButton>
          </div>
        </fieldset>
      </form>
    </Form>
  );
}
