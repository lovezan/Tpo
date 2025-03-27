"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { Menu, User } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { usePathname } from "next/navigation"

export default function Header() {
  const pathname = usePathname()
  const [isAdmin, setIsAdmin] = useState(false)

  // Memoize the check for admin status to prevent unnecessary re-renders
  const checkAdminStatus = useCallback(() => {
    try {
      const adminData = localStorage.getItem("currentAdmin")
      return !!adminData
    } catch (error) {
      console.error("Error checking admin status:", error)
      return false
    }
  }, [])

  useEffect(() => {
    // Check if user is logged in as admin
    try {
      const adminData = localStorage.getItem("currentAdmin")
      setIsAdmin(!!adminData)
    } catch (error) {
      console.error("Error checking admin status:", error)
      setIsAdmin(false)
    }
  }, [pathname]) // Only re-run when pathname changes

  const handleLogout = () => {
    try {
      localStorage.removeItem("currentAdmin")
      setIsAdmin(false)
      window.location.href = "/"
    } catch (error) {
      console.error("Error during logout:", error)
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/apple-touch-icon.png"
              alt="NIT Hamirpur Logo"
              width={40}
              height={40}
              className="rounded-md"
            />
            <span className="hidden font-bold sm:inline-block">NIT Hamirpur Placement Diaries</span>
          </Link>
        </div>

        <nav className="hidden md:flex items-center gap-6">
          <Link
            href="/"
            className={`text-sm font-medium transition-colors hover:text-primary ${pathname === "/" ? "text-primary" : ""}`}
          >
            Home
          </Link>
          <Link
            href="/experiences"
            className={`text-sm font-medium transition-colors hover:text-primary ${pathname.startsWith("/experiences") ? "text-primary" : ""}`}
          >
            Experiences
          </Link>
          <Link
            href="/companies"
            className={`text-sm font-medium transition-colors hover:text-primary ${pathname.startsWith("/companies") ? "text-primary" : ""}`}
          >
            Companies
          </Link>
          <Link
            href="/submit"
            className={`text-sm font-medium transition-colors hover:text-primary ${pathname === "/submit" ? "text-primary" : ""}`}
          >
            Share Your Story
          </Link>
          {isAdmin && (
            <Link
              href="/admin"
              className={`text-sm font-medium transition-colors hover:text-primary ${pathname.startsWith("/admin") ? "text-primary" : ""}`}
            >
              Admin
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-2">
          <ModeToggle />

          {!isAdmin ? (
            <Button asChild variant="outline" size="icon" className="hidden md:flex">
              <Link href="/admin/login">
                <User className="h-5 w-5" />
                <span className="sr-only">Admin Login</span>
              </Link>
            </Button>
          ) : (
            <Button variant="outline" size="sm" className="hidden md:flex" onClick={handleLogout}>
              Logout
            </Button>
          )}

          <Button asChild className="hidden md:flex">
            <Link href="/submit">Submit Experience</Link>
          </Button>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <nav className="flex flex-col gap-4 mt-8">
                <Link href="/" className="text-sm font-medium transition-colors hover:text-primary">
                  Home
                </Link>
                <Link href="/experiences" className="text-sm font-medium transition-colors hover:text-primary">
                  Experiences
                </Link>
                <Link href="/companies" className="text-sm font-medium transition-colors hover:text-primary">
                  Companies
                </Link>
                <Link href="/submit" className="text-sm font-medium transition-colors hover:text-primary">
                  Share Your Story
                </Link>
                {isAdmin && (
                  <Link href="/admin" className="text-sm font-medium transition-colors hover:text-primary">
                    Admin
                  </Link>
                )}
                {!isAdmin ? (
                  <Link href="/admin/login" className="text-sm font-medium transition-colors hover:text-primary">
                    Admin Login
                  </Link>
                ) : (
                  <Button variant="outline" size="sm" onClick={handleLogout}>
                    Logout
                  </Button>
                )}
                <Button asChild className="mt-4">
                  <Link href="/submit">Submit Experience</Link>
                </Button>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}

