"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"
import { toast } from "@/hooks/use-toast"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { login, user } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()

  // Check if user just registered or has a redirect URL
  useEffect(() => {
    const registered = searchParams.get("registered")
    if (registered === "true") {
      toast({
        title: "Registration Successful",
        description: "Please check your email to verify your account, then log in.",
      })
    }

    // Redirect if already logged in
    if (user) {
      const redirectTo = searchParams.get("redirectTo") || "/"
      router.push(redirectTo)
    }
  }, [searchParams, user, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Basic validation
    if (!email || !password) {
      toast({
        title: "Missing Fields",
        description: "Please fill in all fields.",
        variant: "destructive",
      })
      return
    }

    try {
      setIsSubmitting(true)
      await login(email, password)

      // Get the redirect URL from query params or default to home
      const redirectTo = searchParams.get("redirectTo") || "/"
      router.push(redirectTo)
    } catch (error) {
      console.error("Login error:", error)
      // Error is already handled in the login function
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-background auth-page">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-foreground">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link href="/auth/register" className="font-medium text-primary hover:text-primary/90">
              Register
            </Link>
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4 rounded-md shadow-sm">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-foreground">
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full appearance-none rounded-md border border-input bg-background px-3 py-2 placeholder-muted-foreground shadow-sm focus:border-primary focus:outline-none focus:ring-primary sm:text-sm"
                  placeholder="your.name@nith.ac.in"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-foreground">
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full appearance-none rounded-md border border-input bg-background px-3 py-2 placeholder-muted-foreground shadow-sm focus:border-primary focus:outline-none focus:ring-primary sm:text-sm"
                  placeholder="••••••••"
                />
              </div>
              <div className="flex items-center justify-end mt-2">
                <div className="text-sm">
                  <Link href="/auth/forgot-password" className="font-medium text-primary hover:text-primary/90">
                    Forgot your password?
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="group relative flex w-full justify-center rounded-md border border-transparent bg-primary py-2 px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Signing in..." : "Sign in"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

