"use client"

import { FormEvent } from "react"
import { LogOutIcon } from "lucide-react"
import { useAction } from "next-safe-action/hooks"

import { SubmitButton } from "@/components/ui/submit-button"
import { useEmployee } from "@/components/providers/employee-provider"

import { signOutEmployee } from "../employees/actions"

export function POSSignOut() {
  const action = useAction(signOutEmployee)

  const { setEmployee } = useEmployee()

  async function handleLogOut(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()

    const result = await action.executeAsync()

    if (result?.data?.success) {
      setEmployee(null)

      window.location.reload()
    }
  }

  return (
    <form onSubmit={handleLogOut}>
      <SubmitButton variant="ghost" size="sm" loading={action.isPending}>
        Sign Out <LogOutIcon />
      </SubmitButton>
    </form>
  )
}
