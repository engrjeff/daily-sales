'use client';

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { ImageInput } from '@/components/ui/image-input';
import { Input } from '@/components/ui/input';
import { SubmitButton } from '@/components/ui/submit-button';
import { Textarea } from '@/components/ui/textarea';
import { zodResolver } from '@hookform/resolvers/zod';
import { Store } from '@prisma/client';
import { useAction } from 'next-safe-action/hooks';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { updateStore } from '../store/actions';
import { CreateStoreInputs, createStoreSchema } from '../store/schema';

export function StoreSettingsForm({ store }: { store: Store }) {
  const form = useForm<CreateStoreInputs>({
    mode: 'onBlur',
    resolver: zodResolver(createStoreSchema),
    defaultValues: {
      name: store.name,
      description: store.description,
      address: store.address,
      logoUrl: store.logoUrl ?? undefined,
      color: store.color ?? undefined,
      website: store.website ?? '',
      email: store.email ?? '',
      contactNumber: store.contactNumber ?? '',
    },
  });

  const action = useAction(updateStore, {
    onError: ({ error }) => {
      toast.error(
        error.serverError ??
          'An error occured when updating the store. Please try again.'
      );
    },
  });

  function onError(errors: typeof form.formState.errors) {
    console.log(errors);
  }

  async function onSubmit(values: CreateStoreInputs) {
    const result = await action.executeAsync({
      id: store.id,
      ...values,
    });

    if (result?.data?.store?.id) {
      toast.success('Store changes saved!');
    }
  }

  return (
    <Form {...form}>
      <div className="mb-4">
        <p className="text-sm font-semibold">Store Settings</p>
        <p className="text-muted-foreground text-sm">
          Important details for {store.name}
        </p>
      </div>
      <form
        onSubmit={form.handleSubmit(onSubmit, onError)}
        className="max-w-md"
      >
        <fieldset
          className="space-y-3 disabled:cursor-not-allowed disabled:opacity-90"
          disabled={action.isPending}
        >
          <FormField
            control={form.control}
            name="logoUrl"
            render={({ field }) => (
              <FormItem className="max-w-sm">
                <FormLabel>Logo</FormLabel>
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
                <FormLabel>Store name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Store name"
                    className="bg-muted border-border"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  The user-facing name of your store.
                </FormDescription>
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
                    placeholder="Descriptiom"
                    className="bg-muted border-border"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  A short text that best describes your store.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="email@mystore.com"
                    className="bg-muted border-border"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  The email through which customers may contact you.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="website"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Website</FormLabel>
                <FormControl>
                  <Input
                    type="url"
                    inputMode="url"
                    placeholder="www.mystore.com"
                    className="bg-muted border-border"
                    {...field}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="contactNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contact Number</FormLabel>
                <FormControl>
                  <Input
                    type="tel"
                    inputMode="tel"
                    placeholder="+639********"
                    className="bg-muted border-border"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end pt-6">
            <SubmitButton type="submit" size="sm" loading={action.isPending}>
              Save Changes
            </SubmitButton>
          </div>
        </fieldset>
      </form>
    </Form>
  );
}
