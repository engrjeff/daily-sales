import { type Metadata } from "next"
import { KPIs } from "@/features/dashboard/kpis"
import { OrdersChart } from "@/features/dashboard/orders-chart"
import { TopProducts } from "@/features/dashboard/top-products"
import { checkIfOwnerOfStore } from "@/features/store/queries"
import { currentUser } from "@clerk/nextjs/server"

export const metadata: Metadata = {
  title: "Dashboard",
}

export default async function DashboardPage({
  params,
}: {
  params: { storeId: string }
}) {
  await checkIfOwnerOfStore(params.storeId)

  const user = await currentUser()

  return (
    <div className="container max-w-6xl space-y-6">
      {/* greetings */}
      <div>
        <h1 className="font-semibold">Good day, {user?.firstName}.</h1>
        <p className="text-muted-foreground text-sm">
          {"Here's what's happening with your store today."}
        </p>
      </div>

      {/* KPI cards */}
      <KPIs />

      {/* orders chart */}
      <OrdersChart />

      {/* top products */}
      <TopProducts />
    </div>
  )
}
