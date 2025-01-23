import type { Metadata } from "next"
import localFont from "next/font/local"
import { ClerkProvider } from "@clerk/nextjs"
import NextTopLoader from "nextjs-toploader"
import { NuqsAdapter } from "nuqs/adapters/next/app"

import { Toaster } from "@/components/ui/sonner"
import { ReactQueryProvider } from "@/components/providers/react-query-provider"
import { ThemeProvider } from "@/components/providers/theme-provider"

import "./globals.css"

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
})
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
})

export const metadata: Metadata = {
  title: {
    template: "%s | Daily Sales",
    default: "Daily Sales", // a default is required when creating a template
  },
  description: "Simple sales monitoring for your store.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider>
      <html lang="en" className="bg-background text-foreground h-full">
        <body
          className={`${geistSans.variable} ${geistMono.variable} bg-background text-foreground h-full font-sans antialiased`}
        >
          <NextTopLoader color="#2563eb" />
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <NuqsAdapter>
              <ReactQueryProvider>
                {children}
                <Toaster richColors position="top-center" />
              </ReactQueryProvider>
            </NuqsAdapter>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}
