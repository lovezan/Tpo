"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Building, Briefcase, Users, Award } from "lucide-react"
import { getPlacementStats } from "@/lib/data-utils"
import { Skeleton } from "@/components/ui/skeleton"
// Add import for the responsive hook
import { useResponsive } from "@/hooks/use-responsive"

export default function StatsSection() {
  const [stats, setStats] = useState({
    totalExperiences: 0,
    totalCompanies: 0,
    jobProfiles: 0,
    highestPackage: "₹0 LPA",
  })
  const [isLoading, setIsLoading] = useState(true)

  // Inside the component, add this after the useState hooks:
  const { isSmallScreen } = useResponsive()

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoading(true)
        const statsData = await getPlacementStats()
        setStats(statsData)
      } catch (error) {
        console.error("Error fetching stats:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchStats()
  }, [])

  return (
    <section className="container px-4 md:px-6 py-6 md:py-8">
      <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-4 md:mb-6">Placement Highlights</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Experiences</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          {/* Update the card content to be more responsive based on screen size */}
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <>
                <div className="text-xl sm:text-2xl font-bold truncate">{stats.totalExperiences}+</div>
                <p className={`${isSmallScreen ? "text-[10px]" : "text-xs"} text-muted-foreground`}>Shared by alumni</p>
              </>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Companies</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          {/* Do the same for the other card contents */}
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <>
                <div className="text-xl sm:text-2xl font-bold truncate">{stats.totalCompanies}+</div>
                <p className={`${isSmallScreen ? "text-[10px]" : "text-xs"} text-muted-foreground`}>
                  Recruiting from campus
                </p>
              </>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Job Profiles</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          {/* Do the same for the other card contents */}
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <>
                <div className="text-xl sm:text-2xl font-bold truncate">{stats.jobProfiles}+</div>
                <p className={`${isSmallScreen ? "text-[10px]" : "text-xs"} text-muted-foreground`}>
                  Diverse opportunities
                </p>
              </>
            )}
          </CardContent>
        </Card>
        
      </div>
    </section>
  )
}

