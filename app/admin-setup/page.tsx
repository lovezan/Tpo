"use client"

import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, Shield } from "lucide-react"

export default function AdminSetupPage() {
  const { user, loading } = useAuth()
  const [isPromoting, setIsPromoting] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [debugInfo, setDebugInfo] = useState<string | null>(null)

  const handlePromoteToAdmin = async () => {
    if (!user) {
      setMessage({
        type: "error",
        text: "You must be logged in to become an admin.",
      })
      return
    }

    try {
      setIsPromoting(true)
      setMessage(null)
      setDebugInfo(null)

      // First check if the user document exists
      const userRef = doc(db, "users", user.uid)
      const userSnap = await getDoc(userRef)

      if (userSnap.exists()) {
        // Update existing document
        setDebugInfo("User document exists, updating role...")
        await updateDoc(userRef, {
          role: "admin",
        })
      } else {
        // Create new document
        setDebugInfo("User document doesn't exist, creating it...")
        await setDoc(userRef, {
          email: user.email,
          displayName: user.displayName || user.email?.split("@")[0],
          role: "admin",
          createdAt: serverTimestamp(),
        })
      }

      // Store admin info in localStorage for immediate effect
      localStorage.setItem(
        "currentAdmin",
        JSON.stringify({
          uid: user.uid,
          email: user.email,
          name: user.displayName || user.email?.split("@")[0] || "Admin User",
        }),
      )

      setMessage({
        type: "success",
        text: "You have been successfully promoted to admin! Please refresh the page or log out and log back in to access the admin dashboard.",
      })

      // Force a page reload after 3 seconds to refresh the auth state
      setTimeout(() => {
        window.location.href = "/admin"
      }, 3000)
    } catch (error: any) {
      console.error("Error in promotion:", error)
      setMessage({
        type: "error",
        text: `Error: ${error.message || "Unknown error"}`,
      })
      setDebugInfo(`Full error: ${JSON.stringify(error)}`)
    } finally {
      setIsPromoting(false)
    }
  }

  if (loading) {
    return (
      <div className="container py-8 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="container py-8">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Authentication Required</AlertTitle>
          <AlertDescription>
            You need to be logged in to set up an admin account.
            <div className="mt-4">
              <Button asChild size="sm">
                <a href="/auth/login">Login</a>
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="container py-12">
      <div className="max-w-md mx-auto">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Shield className="h-6 w-6 text-primary" />
              <CardTitle>Admin Setup</CardTitle>
            </div>
            <CardDescription>Set up your admin account for the placement portal</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              You are about to promote your account ({user?.email}) to an admin account. This will give you full access
              to manage experiences, approve submissions, and more.
            </p>

            {message && (
              <Alert variant={message.type === "success" ? "default" : "destructive"} className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>{message.type === "success" ? "Success" : "Error"}</AlertTitle>
                <AlertDescription>{message.text}</AlertDescription>
              </Alert>
            )}

            {debugInfo && (
              <div className="mt-4 p-2 bg-gray-100 dark:bg-gray-800 rounded text-xs overflow-auto">
                <pre>{debugInfo}</pre>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button onClick={handlePromoteToAdmin} disabled={isPromoting} className="w-full">
              {isPromoting ? "Promoting..." : "Promote to Admin"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

