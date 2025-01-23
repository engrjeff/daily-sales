import Link from "next/link"

import { buttonVariants } from "@/components/ui/button"

function NotFound() {
  return (
    <div className="flex h-full flex-col items-center justify-center  gap-3 text-center">
      <h1 className="text-2xl font-semibold">DailySales</h1>
      <h2 className="text-primary text-lg font-semibold">404</h2>
      <p>Page not found.</p>

      <Link href="/u" className={buttonVariants({ size: "sm" })}>
        Go to Dashboard
      </Link>
    </div>
  )
}

export default NotFound
