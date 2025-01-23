"use client"

import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { EmployeeStatus } from "@prisma/client"
import { useAction } from "next-safe-action/hooks"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { SubmitButton } from "@/components/ui/submit-button"

import { useStoreId } from "../store/hooks"
import { createEmployeByInvite, createEmployee } from "./actions"
import { EmployeeInputs, employeeSchema } from "./schema"

export function EmployeeForm({ forInvite }: { forInvite?: boolean }) {
  const storeId = useStoreId()

  const form = useForm<EmployeeInputs>({
    mode: "onChange",
    resolver: zodResolver(employeeSchema),
    defaultValues: {
      storeId,
      name: "",
      username: "",
      email: "",
      pin: "",
      avatarUrl: "",
      contactNumber: "",
      status: EmployeeStatus.ACTIVE,
    },
  })

  const router = useRouter()

  const action = useAction(createEmployee, {
    onError: ({ error }) => {
      toast.error(
        error.serverError ??
          "An error occured in creating the employee. Please try again."
      )
    },
  })

  const actionInvite = useAction(createEmployeByInvite, {
    onError: ({ error }) => {
      toast.error(
        error.serverError ??
          "An error occured in creating the employee. Please try again."
      )
    },
  })

  const isPending = action.isPending || actionInvite.isPending

  function onError(errors: typeof form.formState.errors) {
    console.log(errors)
  }

  async function onSubmit(values: EmployeeInputs) {
    if (forInvite) {
      const result = await actionInvite.executeAsync(values)

      if (result?.data?.employee?.id) {
        toast.success("Your data has been saved!")
      }

      window.location.href = `/${storeId}/pos`
    } else {
      const result = await action.executeAsync(values)

      if (result?.data?.employee?.id) {
        toast.success("Employee saved!")
      }
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit, onError)}
        className="max-w-sm w-full"
      >
        <fieldset
          className="space-y-3 disabled:cursor-not-allowed disabled:opacity-90"
          disabled={isPending}
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="John Doe"
                    className="bg-muted border-border"
                    autoFocus
                    {...field}
                  />
                </FormControl>
                <FormDescription>The name of the employee.</FormDescription>
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
                    placeholder="employee@email.com"
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
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Username"
                    className="bg-muted border-border"
                    {...field}
                  />
                </FormControl>
                <FormDescription>Minimum of 6 characters.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="contactNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contact</FormLabel>
                <FormControl>
                  <Input
                    placeholder="+639123456789"
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
            name="pin"
            render={({ field }) => (
              <FormItem>
                <FormLabel>PIN</FormLabel>
                <FormControl>
                  <Input
                    placeholder="123456"
                    className="bg-muted border-border"
                    {...field}
                  />
                </FormControl>
                <FormDescription>6-digit PIN</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end pt-6">
            <SubmitButton type="submit" size="sm" loading={isPending}>
              {forInvite ? "Save My Data" : "Save Employee"}
            </SubmitButton>
          </div>
        </fieldset>
      </form>
    </Form>
  )
}
