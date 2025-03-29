"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendEmailVerification,
  sendPasswordResetEmail,
} from "firebase/auth"
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore"
import { auth, db } from "@/lib/firebase"
import { toast } from "@/hooks/use-toast"

export type UserRole = "student" | "admin"

export interface User {
  uid: string
  email: string | null
  displayName?: string | null
  role: UserRole
  emailVerified: boolean
}

interface AuthContextType {
  user: User | null
  loading: boolean
  register: (email: string, password: string) => Promise<void>
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  resetPassword: (email: string) => Promise<void>
  isAdmin: boolean
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setIsAuthenticated(true)
        try {
          // Get user data from Firestore
          const userDoc = await getDoc(doc(db, "users", firebaseUser.uid))

          if (userDoc.exists()) {
            const userData = userDoc.data()

            // Check if user is admin - this is the source of truth for admin status
            const userRole = userData.role === "admin" ? "admin" : "student"
            setIsAdmin(userRole === "admin")

            setUser({
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              displayName: userData.displayName || firebaseUser.displayName,
              role: userRole,
              emailVerified: firebaseUser.emailVerified,
            })

            // Also set admin data in localStorage for backward compatibility
            if (userRole === "admin") {
              localStorage.setItem(
                "currentAdmin",
                JSON.stringify({
                  uid: firebaseUser.uid,
                  email: firebaseUser.email,
                  name: userData.displayName || firebaseUser.displayName || "Admin User",
                }),
              )
            } else {
              // Ensure non-admin users don't have admin data in localStorage
              localStorage.removeItem("currentAdmin")
            }
          } else {
            // User document doesn't exist, create it
            try {
              await setDoc(doc(db, "users", firebaseUser.uid), {
                email: firebaseUser.email,
                displayName: firebaseUser.displayName || firebaseUser.email?.split("@")[0],
                role: "student", // Default role
                createdAt: serverTimestamp(),
              })

              setUser({
                uid: firebaseUser.uid,
                email: firebaseUser.email,
                displayName: firebaseUser.displayName || firebaseUser.email?.split("@")[0],
                role: "student",
                emailVerified: firebaseUser.emailVerified,
              })

              setIsAdmin(false)
              localStorage.removeItem("currentAdmin")
            } catch (error) {
              console.error("Error creating user document:", error)
              // Still set the user with default values even if document creation fails
              setUser({
                uid: firebaseUser.uid,
                email: firebaseUser.email,
                displayName: firebaseUser.displayName || firebaseUser.email?.split("@")[0],
                role: "student",
                emailVerified: firebaseUser.emailVerified,
              })

              setIsAdmin(false)
              localStorage.removeItem("currentAdmin")
            }
          }
        } catch (error) {
          console.error("Error fetching user data:", error)
          // Still set the user with default values even if fetching fails
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName || firebaseUser.email?.split("@")[0],
            role: "student",
            emailVerified: firebaseUser.emailVerified,
          })

          setIsAdmin(false)
          localStorage.removeItem("currentAdmin")
        }
      } else {
        setUser(null)
        setIsAdmin(false)
        setIsAuthenticated(false)

        // Clear admin data from localStorage
        if (typeof window !== "undefined") {
          localStorage.removeItem("currentAdmin")
        }
      }

      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const register = async (email: string, password: string) => {
    try {
      // Validate email domain
      if (!email.endsWith("@nith.ac.in")) {
        throw new Error("Please use your NIT Hamirpur email (@nith.ac.in)")
      }

      setLoading(true)

      // Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      const firebaseUser = userCredential.user

      // Send email verification
      await sendEmailVerification(firebaseUser)

      // Create user document in Firestore
      try {
        await setDoc(doc(db, "users", firebaseUser.uid), {
          email: firebaseUser.email,
          displayName: email.split("@")[0], // Use part before @ as display name
          role: "student", // Default role
          createdAt: serverTimestamp(),
        })
      } catch (error) {
        console.error("Error creating user document during registration:", error)
        // Continue with registration even if document creation fails
      }

      toast({
        title: "Registration successful!",
        description: "A verification email has been sent. Please verify your email to access all features.",
      })
    } catch (error: any) {
      console.error("Registration error:", error)

      let errorMessage = "Registration failed. Please try again."

      if (error.code === "auth/email-already-in-use") {
        errorMessage = "This email is already registered. Please login instead."
      } else if (error.message) {
        errorMessage = error.message
      }

      toast({
        title: "Registration Error",
        description: errorMessage,
        variant: "destructive",
      })

      throw error
    } finally {
      setLoading(false)
    }
  }

  const login = async (email: string, password: string) => {
    try {
      setLoading(true)

      // Sign in with Firebase Auth
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      const firebaseUser = userCredential.user

      // Get user data from Firestore
      try {
        const userDoc = await getDoc(doc(db, "users", firebaseUser.uid))

        if (userDoc.exists()) {
          const userData = userDoc.data()

          // Check if user is admin
          if (userData.role === "admin") {
            // Store admin info in localStorage for backward compatibility
            localStorage.setItem(
              "currentAdmin",
              JSON.stringify({
                uid: firebaseUser.uid,
                email: firebaseUser.email,
                name: userData.displayName || firebaseUser.displayName || "Admin User",
              }),
            )
          } else {
            // Ensure non-admin users don't have admin data in localStorage
            localStorage.removeItem("currentAdmin")
          }

          toast({
            title: "Login Successful",
            description: `Welcome back, ${userData.displayName || email.split("@")[0]}!`,
          })
        } else {
          // User document doesn't exist, create it
          await setDoc(doc(db, "users", firebaseUser.uid), {
            email: firebaseUser.email,
            displayName: email.split("@")[0], // Use part before @ as display name
            role: "student", // Default role
            createdAt: serverTimestamp(),
          })

          // Ensure non-admin users don't have admin data in localStorage
          localStorage.removeItem("currentAdmin")

          toast({
            title: "Login Successful",
            description: `Welcome, ${email.split("@")[0]}!`,
          })
        }
      } catch (error) {
        console.error("Error fetching/creating user data during login:", error)
        // Continue with login even if document fetching/creation fails
        toast({
          title: "Login Successful",
          description: `Welcome, ${email.split("@")[0]}!`,
        })
      }
    } catch (error: any) {
      console.error("Login error:", error)

      let errorMessage = "Login failed. Please check your credentials and try again."

      if (error.code === "auth/invalid-credential") {
        errorMessage = "Invalid email or password. Please try again."
      } else if (error.code === "auth/user-not-found") {
        errorMessage = "User not found. Please register first."
      } else if (error.code === "auth/wrong-password") {
        errorMessage = "Incorrect password. Please try again."
      } else if (error.message) {
        errorMessage = error.message
      }

      toast({
        title: "Login Error",
        description: errorMessage,
        variant: "destructive",
      })

      throw error
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    try {
      setLoading(true)
      await signOut(auth)

      // Clear admin data from localStorage
      if (typeof window !== "undefined") {
        localStorage.removeItem("currentAdmin")
      }

      toast({
        title: "Logged Out",
        description: "You have been successfully logged out.",
      })
    } catch (error) {
      console.error("Logout error:", error)

      toast({
        title: "Logout Error",
        description: "Failed to log out. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const resetPassword = async (email: string) => {
    try {
      setLoading(true)
      await sendPasswordResetEmail(auth, email)

      toast({
        title: "Password Reset Email Sent",
        description: "Check your email for instructions to reset your password.",
      })
    } catch (error: any) {
      console.error("Password reset error:", error)

      let errorMessage = "Failed to send password reset email. Please try again."

      if (error.code === "auth/user-not-found") {
        errorMessage = "No account found with this email address."
      } else if (error.message) {
        errorMessage = error.message
      }

      toast({
        title: "Password Reset Error",
        description: errorMessage,
        variant: "destructive",
      })

      throw error
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        register,
        login,
        logout,
        resetPassword,
        isAdmin,
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

