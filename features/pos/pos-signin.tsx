"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Store } from "@prisma/client"
import { useAction } from "next-safe-action/hooks"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

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

import { signInEmployee } from "../employees/actions"
import { EmployeeSignInInputs, employeeSignInSchema } from "../employees/schema"
import { POSStoreLink } from "./pos-store-link"

export function POSSignIn({ store }: { store: Store }) {
  const form = useForm<EmployeeSignInInputs>({
    resolver: zodResolver(employeeSignInSchema),
    defaultValues: {
      storeId: store.id,
      email: "",
      pin: "",
    },
  })

  const action = useAction(signInEmployee, {
    onError: ({ error }) => {
      toast.error(error.serverError ?? "An error occurred.")
    },
  })

  async function onSubmit(values: EmployeeSignInInputs) {
    const result = await action.executeAsync(values)

    if (result?.data?.employee?.id) {
      // reload the page
      window.location.reload()
    }
  }

  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 p-6">
      <div className="flex w-full max-w-sm flex-col gap-4">
        <h1 className="text-center text-2xl font-semibold">{store.name} POS</h1>
        <p className="text-muted-foreground text-center">
          Enter your email and PIN to continue.
        </p>

        <Form {...form}>
          <form autoComplete="off" onSubmit={form.handleSubmit(onSubmit)}>
            <fieldset
              className="space-y-4 disabled:cursor-not-allowed disabled:opacity-90"
              disabled={action.isPending}
            >
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="sr-only">Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="employee@store.com"
                        className="bg-muted h-14 w-full"
                        autoComplete="some-email"
                        autoFocus
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="pin"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="sr-only">PIN</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        inputMode="numeric"
                        placeholder="*******"
                        className="bg-muted h-14 w-full"
                        autoComplete="some-pin"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="pt-4">
                <SubmitButton
                  className="h-14 w-full"
                  loading={action.isPending}
                >
                  Submit
                </SubmitButton>
              </div>
            </fieldset>
          </form>
        </Form>

        <POSStoreLink />
      </div>
    </div>
  )
}
