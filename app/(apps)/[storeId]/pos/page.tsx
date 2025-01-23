import { type Metadata } from "next"
import Link from "next/link"
import { redirect } from "next/navigation"
import { POS } from "@/features/pos/pos"
import { POSSignIn } from "@/features/pos/pos-signin"
import { POSSignOut } from "@/features/pos/pos-signout"
import { getStoreByIdExternal } from "@/features/store/queries"
import { SignedIn } from "@clerk/nextjs"
import { Redo2Icon } from "lucide-react"

import { verifyEmployeeToken } from "@/lib/server"
import { buttonVariants } from "@/components/ui/button"
import { EmployeeProvider } from "@/components/providers/employee-provider"

export const metadata: Metadata = {
  title: "POS",
}

async function POSPage({ params }: { params: { storeId: string } }) {
  const store = await getStoreByIdExternal(params.storeId)

  if (!store) redirect("/invalid-store")

  const employee = await verifyEmployeeToken()

  if (!employee)
    return (
      <div className="h-full">
        <POSSignIn store={store} />
      </div>
    )

  return (
    <EmployeeProvider employee={employee}>
      <div className="flex h-full flex-col gap-2">
        <div className="flex items-center p-4 pb-0">
          <div>
            <h1 className="font-semibold">{store?.name} POS</h1>
            <p className="text-muted-foreground text-sm">
              Hi, {employee.name}.
            </p>
          </div>

          <div className="ml-auto flex items-center gap-2">
            <SignedIn>
              <Link
                href={`/${params.storeId}/orders`}
                className={buttonVariants({ size: "sm", variant: "cool" })}
              >
                Back to Orders <Redo2Icon />
              </Link>
            </SignedIn>

            {employee ? <POSSignOut /> : null}
          </div>
        </div>
        <POS />
      </div>
    </EmployeeProvider>
  )
}

export default POSPage
