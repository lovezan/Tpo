"use client"

import { useState, useEffect } from "react"

type Breakpoint = "xs" | "sm" | "md" | "lg" | "xl"

export function useResponsive() {
  const [breakpoint, setBreakpoint] = useState<Breakpoint>("xs")
  const [isMobile, setIsMobile] = useState(false)
  const [isTablet, setIsTablet] = useState(false)
  const [isDesktop, setIsDesktop] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth

      if (width < 640) {
        setBreakpoint("xs")
        setIsMobile(true)
        setIsTablet(false)
        setIsDesktop(false)
      } else if (width >= 640 && width < 768) {
        setBreakpoint("sm")
        setIsMobile(false)
        setIsTablet(true)
        setIsDesktop(false)
      } else if (width >= 768 && width < 1024) {
        setBreakpoint("md")
        setIsMobile(false)
        setIsTablet(true)
        setIsDesktop(false)
      } else if (width >= 1024 && width < 1280) {
        setBreakpoint("lg")
        setIsMobile(false)
        setIsTablet(false)
        setIsDesktop(true)
      } else {
        setBreakpoint("xl")
        setIsMobile(false)
        setIsTablet(false)
        setIsDesktop(true)
      }
    }

    // Set initial values
    handleResize()

    // Add event listener
    window.addEventListener("resize", handleResize)

    // Clean up
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return {
    breakpoint,
    isMobile,
    isTablet,
    isDesktop,
    isSmallScreen: breakpoint === "xs" || breakpoint === "sm",
    isMediumScreen: breakpoint === "md",
    isLargeScreen: breakpoint === "lg" || breakpoint === "xl",
  }
}

