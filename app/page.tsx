import Link from "next/link"
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs"
import { currentUser } from "@clerk/nextjs/server"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

export default async function Home() {
  const user = await currentUser()

  return (
    <div className="container mx-auto flex min-h-full max-w-screen-lg flex-col px-6">
      <header className="flex justify-between py-6">
        <Link href="/" className="font-semibold">
          DailySales
        </Link>

        <div className="flex items-center gap-3">
          <SignedOut>
            <Link
              href="/sign-in"
              className={cn(
                buttonVariants({ variant: "outline" }),
                "bg-muted border-border rounded-full"
              )}
            >
              Sign In
            </Link>
            <Link
              href="/sign-up"
              className={cn(buttonVariants(), "rounded-full")}
            >
              Register
            </Link>
          </SignedOut>
          <SignedIn>
            <Link
              href="/u"
              className={cn(
                buttonVariants({ variant: "cool" }),
                "rounded-full"
              )}
            >
              Dashboard
            </Link>
            <UserButton />
          </SignedIn>
        </div>
      </header>
      <main className="flex flex-1 flex-col items-center py-20">
        <SignedOut>
          <h1 className="my-6 text-center text-6xl font-bold">
            Welcome to Daily Sales!
          </h1>
        </SignedOut>
        <SignedIn>
          <h1 className="my-6 text-center text-6xl font-bold">
            Welcome back, {user?.firstName}!
          </h1>
        </SignedIn>

        <p className="text-muted-foreground mb-6 text-center text-lg">
          {"Keep track of your store's sales."}
        </p>

        <SignedOut>
          <Link
            href="/sign-up"
            className={cn(buttonVariants(), "rounded-full")}
          >
            Get Started
          </Link>
        </SignedOut>
        <SignedIn>
          <Link href="/u" className={cn(buttonVariants(), "rounded-full")}>
            Go to Dashboard
          </Link>
        </SignedIn>
      </main>

      <footer className="py-4">
        <p className="text-center text-sm">
          Created by{" "}
          <a
            href="https://jeffsegovia.dev"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary font-semibold"
          >
            Jeff Segovia
          </a>
        </p>
      </footer>
    </div>
  )
}
