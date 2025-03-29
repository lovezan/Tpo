"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Lock } from "lucide-react"

interface AuthGuardProps {
  children: React.ReactNode
  returnUrl?: string
}

export default function AuthGuard({ children, returnUrl = "" }: AuthGuardProps) {
  const { isAuthenticated, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // Only redirect after auth state is confirmed and user is not authenticated
    if (!loading && !isAuthenticated) {
      const encodedReturnUrl = encodeURIComponent(returnUrl || window.location.pathname)
      router.push(`/auth/login?redirectTo=${encodedReturnUrl}`)
    }
  }, [isAuthenticated, loading, router, returnUrl])

  // Show loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  // If not authenticated, show login prompt
  if (!isAuthenticated) {
    return (
      <Card className="max-w-md mx-auto my-8">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Lock className="h-5 w-5 text-primary" />
            <CardTitle>Authentication Required</CardTitle>
          </div>
          <CardDescription>You need to be logged in to access this content</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            This content is only available to authenticated NIT Hamirpur students. Please log in with your NITH email to
            view this content.
          </p>
        </CardContent>
        <CardFooter>
          <Button
            onClick={() => {
              const encodedReturnUrl = encodeURIComponent(returnUrl || window.location.pathname)
              router.push(`/auth/login?redirectTo=${encodedReturnUrl}`)
            }}
            className="w-full"
          >
            Log in to Continue
          </Button>
        </CardFooter>
      </Card>
    )
  }

  // If authenticated, render children
  return <>{children}</>
}

