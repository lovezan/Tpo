"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, Info } from "lucide-react"
import { authenticateAdmin } from "@/lib/data-utils"
import { toast } from "@/hooks/use-toast"

const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email." }),
  password: z.string().min(1, { message: "Password is required." }),
})

export default function AdminLoginPage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    setError(null)

    try {
      console.log("Attempting to login with:", values.email)

      // For development purposes - REMOVE IN PRODUCTION
      // This allows login with admin@nith.ac.in/password without Firebase Auth
      if (values.email === "admin@nith.ac.in" && values.password === "password") {
        const demoAdmin = {
          uid: "demo-admin",
          email: values.email,
          name: "Demo Admin",
        }

        // Store admin info in localStorage
        localStorage.setItem("currentAdmin", JSON.stringify(demoAdmin))

        toast({
          title: "Development Login Successful",
          description: `Welcome, Demo Admin! (Development Mode)`,
        })

        // Redirect to admin dashboard
        router.push("/admin")
        return
      }

      // Try Firebase authentication
      const admin = await authenticateAdmin(values.email, values.password)

      if (admin) {
        console.log("Admin authenticated successfully:", admin.name)
        // Store admin info in localStorage
        localStorage.setItem("currentAdmin", JSON.stringify(admin))

        toast({
          title: "Login Successful",
          description: `Welcome back, ${admin.name}!`,
        })

        // Redirect to admin dashboard
        router.push("/admin")
      } else {
        setError("Invalid email or password. Please try again.")
      }
    } catch (error: any) {
      console.error("Login error:", error)

      if (error.code === "auth/invalid-credential") {
        setError("Invalid email or password. Please try again.")
      } else if (error.code === "auth/user-not-found") {
        setError("User not found. Please check your email address.")
      } else if (error.code === "auth/wrong-password") {
        setError("Incorrect password. Please try again.")
      } else {
        setError(error.message || "An error occurred. Please try again.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container flex items-center justify-center py-12 md:py-24">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Admin Login</CardTitle>
          <CardDescription>Login to access the admin dashboard</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert className="mb-6">
            <Info className="h-4 w-4" />
            <AlertTitle>Development Mode</AlertTitle>
            <AlertDescription>
              For testing, use email: <strong>admin@nith.ac.in</strong> and password: <strong>password</strong>
            </AlertDescription>
          </Alert>

          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="admin@nith.ac.in" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Logging in..." : "Login"}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-center text-sm text-muted-foreground">
          <p>Use your admin credentials to login</p>
        </CardFooter>
      </Card>
    </div>
  )
}

