'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, ArrowRight, CheckIcon } from 'lucide-react';
import { useAction } from 'next-safe-action/hooks';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { SubmitButton } from '@/components/ui/submit-button';
import { Textarea } from '@/components/ui/textarea';

import { createStore } from './actions';
import { type CreateStoreInputs, createStoreSchema } from './schema';

export function StoreForm() {
  const [step, setStep] = useState(1);

  const router = useRouter();

  const createAction = useAction(createStore, {
    onError: ({ error }) => {
      if (error.serverError === 'The store name you provided already exists.') {
        form.setError('name', { message: error.serverError });
        form.setFocus('name');

        setStep(1);
        return;
      }

      toast.error('The store was not created. Please try again.');
    },
  });

  const form = useForm<CreateStoreInputs>({
    resolver: zodResolver(createStoreSchema),
    mode: 'all',
    defaultValues: {
      name: '',
      description: '',
      address: '',
    },
  });

  async function goToNext() {
    if (step === 1) {
      const isNameValid = await form.trigger('name');
      if (!isNameValid) return;
    }

    if (step === 2) {
      const isDescValid = await form.trigger('description');
      if (!isDescValid) return;
    }

    setStep((currentStep) => currentStep + 1);
  }

  function goBack() {
    setStep((currentStep) =>
      currentStep === 1 ? currentStep : currentStep - 1
    );
  }

  function onError(errors: typeof form.formState.errors) {
    console.log(errors);
  }

  async function onSubmit(values: CreateStoreInputs) {
    const result = await createAction.executeAsync(values);
    if (result?.data?.store.id) {
      toast.success('Store saved');

      router.replace(`/${result.data.store.id}/dashboard`);
    }
  }

  return (
    <div className="flex gap-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit, onError)}>
          <fieldset
            disabled={createAction.isPending}
            className="p-8 w-[360px] shrink-0 disabled:opacity-80 disabled:pointer-events-none disabled:cursor-not-allowed"
          >
            {step === 1 ? (
              <>
                <div className="space-y-2 py-6">
                  <h1 className="text-2xl font-bold">
                    First, let us add your store.
                  </h1>
                  <p className="text-muted-foreground">
                    What store do you want to track sales for?
                  </p>
                </div>
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="space-y-0">
                      <FormLabel className="sr-only">Store name</FormLabel>
                      <FormControl>
                        <Input placeholder="My Store" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            ) : null}

            {step === 2 ? (
              <>
                <div className="space-y-2 py-6">
                  <h1 className="text-2xl font-bold">
                    Next, describe your store.
                  </h1>
                  <p className="text-muted-foreground">
                    What best describes your store?
                  </p>
                </div>
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem className="space-y-0">
                      <FormLabel className="sr-only">Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="A coffee and pastries store..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            ) : null}

            {step === 3 ? (
              <>
                <div className="space-y-2 py-6">
                  <h1 className="text-2xl font-bold">
                    Now specify where your store is located.
                  </h1>
                  <p className="text-muted-foreground">
                    Where is your store located?
                  </p>
                </div>
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem className="space-y-0">
                      <FormLabel className="sr-only">Address</FormLabel>
                      <FormControl>
                        <Textarea placeholder="My store address" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            ) : null}

            <div className="py-6 flex items-center gap-3">
              {step > 1 ? (
                <Button
                  aria-label="Go back"
                  type="button"
                  onClick={goBack}
                  size="icon"
                  variant="outline"
                >
                  <ArrowLeft size={16} />
                </Button>
              ) : null}
              {step === 3 ? (
                <SubmitButton
                  disabled={!form.formState.isValid}
                  loading={createAction.isPending}
                >
                  Save Store <CheckIcon />
                </SubmitButton>
              ) : (
                <Button type="button" onClick={goToNext}>
                  Next <ArrowRight size={16} />
                </Button>
              )}
            </div>
          </fieldset>
        </form>
      </Form>

      <div className="bg-gradient-to-r from-emerald-500 to-green-500 rounded-lg flex flex-col justify-center p-8">
        <p className="text-4xl font-bold">DailySales</p>
        <p>Simple sales monitoring for your store.</p>
      </div>
    </div>
  );
}