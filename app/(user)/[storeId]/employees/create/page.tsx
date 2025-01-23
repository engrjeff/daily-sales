import Link from "next/link"
import { EmployeeForm } from "@/features/employees/employee-form"
import { ArrowLeftIcon } from "lucide-react"

import { Separator } from "@/components/ui/separator"

function EmployeeCreatePage({ params }: { params: { storeId: string } }) {
  return (
    <div className="container flex max-w-5xl flex-1 flex-col gap-6">
      <div className="flex items-start gap-2">
        <Link
          href={`/${params.storeId}/employees`}
          aria-label="Go back to product list"
          className="hover:bg-secondary inline-flex size-8 items-center justify-center rounded-md"
        >
          <ArrowLeftIcon className="size-4" aria-hidden={true} />
        </Link>
        <div>
          <h1 className="font-semibold">Add Employee</h1>
          <p className="text-muted-foreground text-sm">
            Fill in the form below.
          </p>
        </div>
      </div>
      <Separator />
      <EmployeeForm />
    </div>
  )
}

export default EmployeeCreatePage
