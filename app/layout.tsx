import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import "./mobile-fixes.css"
import "./hero-styles.css"
import { ThemeProvider } from "@/components/theme-provider"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { Toaster } from "@/components/ui/toaster"
import DataInitializer from "@/components/data-initializer"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "NIT Hamirpur Placement Experience Portal",
  description: "A platform for NIT Hamirpur students to share placement experiences and insights",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="nith-theme" enableSystem>
          <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
          <Toaster />
          <DataInitializer />
        </ThemeProvider>
      </body>
    </html>
  )
}

