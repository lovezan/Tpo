"use client"

import { useState, useEffect } from "react"
// Remove Link import if it's not used elsewhere in the file
import Image from "next/image"
import { useSearchParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Lock } from "lucide-react"
import { getCompanies } from "@/lib/data-utils"
import { toast } from "@/hooks/use-toast"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"

export default function CompanyList() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { isAuthenticated, loading } = useAuth()
  const [companies, setCompanies] = useState<any[]>([])
  const [displayedCompanies, setDisplayedCompanies] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showPreview, setShowPreview] = useState(true)

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        setIsLoading(true)
        const companiesData = await getCompanies()
        const companyNames = Array.isArray(companiesData) ? companiesData : []
        setCompanies(companyNames)
        setDisplayedCompanies(companyNames)
      } catch (error) {
        console.error("Error fetching companies:", error)
        toast({
          title: "Error",
          description: "Failed to load companies. Please try again.",
          variant: "destructive",
        })
        setCompanies([])
        setDisplayedCompanies([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchCompanies()
  }, [])

  // Update the useEffect for filtering to only filter by search query
  useEffect(() => {
    if (isLoading || companies.length === 0) return

    // Get search parameters
    const query = searchParams?.get("query")?.toLowerCase() || ""

    // Apply filters
    let filtered = [...companies]

    // Filter by search query
    if (query) {
      filtered = filtered.filter((company) => company.name.toLowerCase().includes(query))
    }

    // Update displayed companies
    setDisplayedCompanies(filtered)
  }, [searchParams, isLoading, companies])

  // For non-authenticated users, show a preview
  useEffect(() => {
    if (!loading) {
      setShowPreview(!isAuthenticated)
    }
  }, [isAuthenticated, loading])

  // Handle login redirect
  const handleLoginRedirect = () => {
    router.push(`/auth/login?redirectTo=${encodeURIComponent("/companies")}`)
  }

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  // Show preview for non-authenticated users
  if (showPreview) {
    return (
      <div className="space-y-8">
        {/* Preview section with limited companies */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {displayedCompanies.slice(0, 3).map((company, index) => (
            <Card key={index} className="flex flex-col h-full relative overflow-hidden">
              <div className="absolute inset-0 bg-black/5 backdrop-blur-[1px] flex items-center justify-center">
                <div className="bg-background/80 p-4 rounded-lg flex items-center gap-2">
                  <Lock className="h-5 w-5 text-primary" />
                  <span className="font-medium">Login to View</span>
                </div>
              </div>
              <CardHeader className="pb-4 opacity-50">
                <div className="flex items-center gap-4">
                  <Image
                    src={company.logo || "/placeholder.svg?height=60&width=60"}
                    alt={`${company.name} logo`}
                    width={60}
                    height={60}
                    className="rounded-md"
                  />
                  <div>
                    <CardTitle className="text-xl">{company.name}</CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex-1 opacity-50">
                <div className="flex items-center gap-2 text-sm mt-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Experiences Shared:</span>
                  <span className="font-medium">{company.experiencesCount || 0}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Login prompt */}
        <Card className="bg-muted/50 border-primary/20">
          <CardContent className="p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-full">
                <Lock className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Login to Access Company Profiles</h3>
                <p className="text-sm text-muted-foreground">
                  View detailed company information, placement statistics, and more
                </p>
              </div>
            </div>
            <Button onClick={handleLoginRedirect}>Login Now</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!displayedCompanies.length) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium">No companies found</h3>
        <p className="text-muted-foreground mt-2">Try adjusting your filters or search criteria</p>
      </div>
    )
  }

  // For authenticated users, show all companies
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {displayedCompanies.map((company, index) => (
        <Card key={index} className="flex flex-col h-full">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-4">
              <Image
                src={company.logo || "/placeholder.svg?height=60&width=60"}
                alt={`${company.name} logo`}
                width={60}
                height={60}
                className="rounded-md"
              />
              <div>
                <CardTitle className="text-xl">{company.name}</CardTitle>
              </div>
            </div>
          </CardHeader>
          <CardContent className="flex-1">
            <div className="flex items-center gap-2 text-sm mt-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Experiences Shared:</span>
              <span className="font-medium">{company.experiencesCount || 0}</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

