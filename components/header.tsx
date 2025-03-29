"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { useAuth } from "@/contexts/auth-context"
import { Menu, X, User, LogOut, Shield } from "lucide-react"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()
  const { user, isAdmin, logout } = useAuth()

  // Close menu when route changes
  useEffect(() => {
    setIsMenuOpen(false)
  }, [pathname])

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
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
              <span className=" font-bold sm:inline-block text-foreground dark:text-white nith-theme:text-white">
                NITH Career Compass
              </span>
            
            </div>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link
            href="/"
            className={`text-sm font-medium transition-colors hover:text-primary ${
              pathname === "/" ? "text-primary" : "text-muted-foreground"
            }`}
          >
            Home
          </Link>
          <Link
            href="/experiences"
            className={`text-sm font-medium transition-colors hover:text-primary ${
              pathname === "/experiences" ? "text-primary" : "text-muted-foreground"
            }`}
          >
            Experiences
          </Link>
          <Link
            href="/companies"
            className={`text-sm font-medium transition-colors hover:text-primary ${
              pathname === "/companies" ? "text-primary" : "text-muted-foreground"
            }`}
          >
            Companies
          </Link>
          
          <Link
            href="/submit"
            className={`text-sm font-medium transition-colors hover:text-primary ${
              pathname === "/submit" ? "text-primary" : "text-muted-foreground"
            }`}
          >
            Submit
          </Link>
          

          {/* Admin link for admin users */}
          {isAdmin && (
            <Link
              href="/admin"
              className={`text-sm font-medium transition-colors hover:text-primary flex items-center gap-1 ${
                pathname === "/admin" ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <Shield className="h-4 w-4" />
              Admin
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-2">
          <ModeToggle />

          {user ? (
            <div className="hidden md:flex items-center gap-2">
              <Button variant="ghost" size="icon" className="rounded-full" asChild>
                <Link href="/profile">
                  <User className="h-5 w-5" />
                  <span className="sr-only">Profile</span>
                </Link>
              </Button>
              <Button variant="ghost" size="icon" onClick={handleLogout}>
                <LogOut className="h-5 w-5" />
                <span className="sr-only">Logout</span>
              </Button>
            </div>
          ) : (
            <div className="hidden md:block">
              <Button asChild variant="default" size="sm">
                <Link href="/auth/login">Login</Link>
              </Button>
            </div>
          )}

          <Button variant="ghost" size="icon" className="md:hidden" onClick={toggleMenu} aria-label="Toggle menu">
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden border-t">
          
          <div className="container py-4 flex flex-col gap-4">
            <Link
              href="/"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                pathname === "/" ? "text-primary" : "text-muted-foreground"
              }`}
            >
              Home
            </Link>
            <Link
              href="/experiences"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                pathname === "/experiences" ? "text-primary" : "text-muted-foreground"
              }`}
            >
              Experiences
            </Link>
            <Link
              href="/companies"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                pathname === "/companies" ? "text-primary" : "text-muted-foreground"
              }`}
            >
              Companies
            </Link>
           
            <Link
              href="/submit"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                pathname === "/submit" ? "text-primary" : "text-muted-foreground"
              }`}
            >
              Submit
            </Link>
           

            {/* Admin link for admin users */}
            {isAdmin && (
              <Link
                href="/admin"
                className={`text-sm font-medium transition-colors hover:text-primary flex items-center gap-1 ${
                  pathname === "/admin" ? "text-primary" : "text-muted-foreground"
                }`}
              >
                <Shield className="h-4 w-4" />
                Admin
              </Link>
            )}

            {user ? (
              <div className="flex flex-col gap-2 pt-2 border-t">
                <Link
                  href="/profile"
                  className="text-sm font-medium transition-colors hover:text-primary text-muted-foreground flex items-center gap-2"
                >
                  <User className="h-4 w-4" />
                  Profile
                </Link>
                <Button
                  variant="ghost"
                  className="justify-start p-0 h-auto font-medium text-sm text-muted-foreground hover:text-primary"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
            ) : (
              <div className="pt-2 border-t">
                <Button asChild>
                  <Link href="/auth/login">Login</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  )
}

