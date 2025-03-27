"use client"

import { useEffect, useRef } from "react"
import { getExperiences, getCompanies } from "@/lib/data-utils"

export default function DataInitializer() {
  const initialized = useRef(false)

  useEffect(() => {
    // Check if data is already initialized
    if (initialized.current) return

    initialized.current = true

    const initializeData = async () => {
      try {
        console.log("Checking Firebase connection...")

        // Instead of trying to write data, just check if we can read data
        // This is less likely to trigger permission errors
        await Promise.all([getExperiences(), getCompanies()])

        console.log("Firebase connection successful")
        localStorage.setItem("firebase_connection_verified", "true")
      } catch (error: any) {
        console.error("Error connecting to Firebase:", error)

        // Don't show error toast to users - just log it
        // The app will fall back to mock data
      }
    }

    initializeData()
  }, []) // Empty dependency array ensures this runs only once

  return null
}

