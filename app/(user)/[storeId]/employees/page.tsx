import { Metadata } from "next"
import Link from "next/link"
import { EmployeeInviteDialog } from "@/features/employees/employee-invite-dialog"
import { EmployeesTable } from "@/features/settings/employees-table"
import { UserPlusIcon } from "lucide-react"

import { buttonVariants } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "Employees",
}

function EmployeesPage({ params }: { params: { storeId: string } }) {
  return (
    <div className="container flex max-w-5xl flex-1 flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-semibold">Employees</h1>
          <p className="text-muted-foreground text-sm">
            View, create, and manage your employees.
          </p>
        </div>
        <div className="ml-auto space-x-3">
          <Link
            href={`/${params.storeId}/employees/create`}
            className={buttonVariants({ size: "sm" })}
          >
            <UserPlusIcon />
            Add Employee
          </Link>

          <EmployeeInviteDialog />
        </div>
      </div>
      <EmployeesTable storeId={params.storeId} />
    </div>
  )
}

export default EmployeesPage
