"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Store } from "@prisma/client"
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
import { NumberInput } from "@/components/ui/number-input"
import { SubmitButton } from "@/components/ui/submit-button"

import { setStoreGoals } from "../store/actions"
import { SetGoalsInputs, setGoalsSchema } from "../store/schema"

export function GoalsForm({ store }: { store: Store }) {
  const form = useForm<SetGoalsInputs>({
    mode: "onBlur",
    resolver: zodResolver(setGoalsSchema),
    defaultValues: {
      storeId: store.id,
      salesGoalValue: store.salesGoalValue ?? 0,
      ordersGoalValue: store.ordersGoalValue ?? 0,
    },
  })

  const action = useAction(setStoreGoals, {
    onError: ({ error }) => {
      toast.error(
        error.serverError ??
          "An error occured in saving the goals. Please try again."
      )
    },
  })

  function onError(errors: typeof form.formState.errors) {
    console.log(errors)
  }

  async function onSubmit(values: SetGoalsInputs) {
    const result = await action.executeAsync(values)

    if (result?.data?.store?.id) {
      toast.success("Store goals saved!")
    }
  }

  return (
    <>
      <div>
        <p className="text-sm font-semibold">Goals</p>
        <p className="text-muted-foreground text-sm">
          Set sales and orders goals.
        </p>
      </div>

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
              name="salesGoalValue"
              render={() => (
                <FormItem>
                  <FormLabel>Sales</FormLabel>
                  <FormControl>
                    <NumberInput
                      placeholder="0.00"
                      currency="Php"
                      className="bg-muted border-border"
                      autoFocus
                      {...form.register("salesGoalValue", {
                        valueAsNumber: true,
                      })}
                    />
                  </FormControl>
                  <FormDescription>
                    This is the amount of sales you desire to achieve.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="ordersGoalValue"
              render={() => (
                <FormItem>
                  <FormLabel>Orders</FormLabel>
                  <FormControl>
                    <NumberInput
                      noDecimal
                      placeholder="0"
                      className="bg-muted border-border"
                      {...form.register("ordersGoalValue", {
                        valueAsNumber: true,
                      })}
                    />
                  </FormControl>
                  <FormDescription>
                    This is the number of orders you wish to achieve.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end pt-6">
              <SubmitButton type="submit" size="sm" disabled={action.isPending}>
                Save Goals
              </SubmitButton>
            </div>
          </fieldset>
        </form>
      </Form>
    </>
  )
}
