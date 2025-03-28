"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users } from "lucide-react"
import { getCompanies } from "@/lib/data-utils"
import { toast } from "@/hooks/use-toast"

export default function CompanyList() {
  const searchParams = useSearchParams()
  const [companies, setCompanies] = useState<any[]>([])
  const [displayedCompanies, setDisplayedCompanies] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        setIsLoading(true)
        const companiesData = await getCompanies()
        setCompanies(Array.isArray(companiesData) ? companiesData : [])
        setDisplayedCompanies(Array.isArray(companiesData) ? companiesData : [])
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

  // Apply filters when search params change
  useEffect(() => {
    if (isLoading || companies.length === 0) return

    // Get search parameters
    const query = searchParams?.get("query")?.toLowerCase() || ""
    const category = searchParams?.get("category")?.toLowerCase() || ""

    // Apply filters
    let filtered = [...companies]

    // Filter by search query
    if (query) {
      filtered = filtered.filter(
        (company) =>
          company.name.toLowerCase().includes(query) ||
          (company.category && company.category.toLowerCase().includes(query)),
      )
    }

    // Filter by category
    if (category && category !== "all") {
      filtered = filtered.filter(
        (company) => company.category && company.category.toLowerCase().replace(/\s+/g, "-") === category,
      )
    }

    // Update displayed companies
    setDisplayedCompanies(filtered)
  }, [searchParams, isLoading, companies])

  if (isLoading) {
    return <div className="text-center py-12">Loading companies...</div>
  }

  if (!displayedCompanies.length) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium">No companies found</h3>
        <p className="text-muted-foreground mt-2">Try adjusting your filters or search criteria</p>
      </div>
    )
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {displayedCompanies.map((company) => (
        <Link href={`/companies/${company.id}`} key={company.id}>
          <Card className="flex flex-col h-full hover:shadow-md transition-shadow">
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
                  <Badge variant="outline" className="mt-1">
                    {company.category || "Tech"}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex-1">
              <div className="flex items-center gap-2 text-sm mt-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Students Placed:</span>
                <span className="font-medium">{company.studentsPlaced}</span>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  )
}

