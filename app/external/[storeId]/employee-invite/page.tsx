import { redirect } from "next/navigation"
import { EmployeeForm } from "@/features/employees/employee-form"
import { getStoreByIdExternal } from "@/features/store/queries"

async function EmployeeInvitePage({ params }: { params: { storeId: string } }) {
  const store = await getStoreByIdExternal(params.storeId)

  if (!store) redirect("/invalid-store")

  return (
    <div className="container relative h-full justify-center items-center flex max-w-5xl p-4 flex-col space-y-6 overflow-hidden">
      <div className="flex flex-col gap-2 text-center">
        <h1 className="text-2xl font-semibold">
          Welcome! <br /> You have been invited as an employee of{" "}
          <span className="text-primary">{store.name}</span>
        </h1>
        <p className="text-muted-foreground">
          Start by filling in the form below.
        </p>
      </div>

      <EmployeeForm forInvite />
    </div>
  )
}

export default EmployeeInvitePage
