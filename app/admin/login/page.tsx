"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, Info } from "lucide-react"
import { authenticateAdmin } from "@/lib/data-utils"
import { useAuth } from "@/contexts/auth-context"
import Link from "next/link"

export default function AdminLoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const { isAdmin, isAuthenticated } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      const admin = await authenticateAdmin(email, password)
      if (admin) {
        router.push("/admin")
      } else {
        setError("Invalid credentials. Please try again.")
      }
    } catch (error: any) {
      setError(error.message || "Failed to login. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  // If already authenticated as admin, redirect to admin dashboard
  if (isAuthenticated && isAdmin) {
    router.push("/admin")
    return null
  }

  return (
    <div className="container py-8 md:py-12">
      <div className="max-w-md mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Admin Login</CardTitle>
            <CardDescription>Login to access the admin dashboard</CardDescription>
          </CardHeader>
          <CardContent>
            <Alert className="mb-4">
              <Info className="h-4 w-4" />
              <AlertTitle>Admin Access</AlertTitle>
              <AlertDescription>
                This area is restricted to administrators only. If you need to set up an admin account, please visit the{" "}
                <Link href="/admin-setup" className="font-medium underline">
                  admin setup page
                </Link>
                .
              </AlertDescription>
            </Alert>

            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@nith.ac.in"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </form>
          </CardContent>
          <CardFooter>
            <Button onClick={handleSubmit} disabled={isLoading} className="w-full">
              {isLoading ? "Logging in..." : "Login"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

