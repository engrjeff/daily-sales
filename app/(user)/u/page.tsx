import { redirect } from "next/navigation"
import { getStores } from "@/features/store/queries"
import { Loader2Icon } from "lucide-react"

async function UserPage() {
  const stores = await getStores()

  if (!stores.length) return redirect(`/create-store`)

  if (stores.length > 0) return redirect(`/${stores[0].id}/dashboard`)

  return (
    <div className="flex h-full flex-col items-center justify-center gap-2">
      <Loader2Icon className="text-primary size-8 animate-spin" />
      <p>Redirecting... please wait.</p>
    </div>
  )
}

export default UserPage
