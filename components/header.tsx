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
    <header
      className="sticky top-0 z-50 w-full border-b backdrop-blur-md supports-[backdrop-filter]:bg-transparent"
      style={{ backgroundColor: "hsl(var(--header-background))" }}
    >
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/nith.png"
              alt="NIT Hamirpur Logo"
              width={40}
              height={40}
              className="rounded-md"
            />
            <div className="flex flex-col">
              <span className="hidden font-bold sm:inline-block text-foreground dark:text-white nith-theme:text-white">
                NITH Career Compass
              </span>
            
            </div>
          </Link>
        </div>

        <nav className="hidden md:flex items-center gap-6">
          <Link
            href="/"
            className={`text-sm font-medium transition-colors hover:text-primary dark:hover:text-primary nith-theme:text-white nith-theme:hover:text-gold ${pathname === "/" ? "text-primary dark:text-primary nith-theme:text-gold" : ""}`}
          >
            Home
          </Link>
          <Link
            href="/experiences"
            className={`text-sm font-medium transition-colors hover:text-primary dark:hover:text-primary nith-theme:text-white nith-theme:hover:text-gold ${pathname.startsWith("/experiences") ? "text-primary dark:text-primary nith-theme:text-gold" : ""}`}
          >
            Experiences
          </Link>
          <Link
            href="/companies"
            className={`text-sm font-medium transition-colors hover:text-primary dark:hover:text-primary nith-theme:text-white nith-theme:hover:text-gold ${pathname.startsWith("/companies") ? "text-primary dark:text-primary nith-theme:text-gold" : ""}`}
          >
            Companies
          </Link>
          {isAdmin && (
            <Link
              href="/admin"
              className={`text-sm font-medium transition-colors hover:text-primary dark:hover:text-primary nith-theme:text-white nith-theme:hover:text-gold ${pathname.startsWith("/admin") ? "text-primary dark:text-primary nith-theme:text-gold" : ""}`}
            >
              Admin
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-2">
          <ModeToggle />

          {!isAdmin ? (
            <Button
              asChild
              variant="outline"
              size="icon"
              className="hidden md:flex nith-theme:border-white nith-theme:text-white nith-theme:bg-transparent"
            >
              <Link href="/admin/login">
                <User className="h-5 w-5" />
                <span className="sr-only">Admin Login</span>
              </Link>
            </Button>
          ) : (
            <Button
              variant="outline"
              size="sm"
              className="hidden md:flex nith-theme:border-white nith-theme:text-white nith-theme:bg-transparent"
              onClick={handleLogout}
            >
              Logout
            </Button>
          )}

          <Button asChild className="hidden md:flex">
            <Link href="/submit">Submit Experience</Link>
          </Button>

          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="md:hidden nith-theme:border-white nith-theme:text-white nith-theme:bg-transparent"
              >
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
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}

