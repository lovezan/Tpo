"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users } from "lucide-react"
import { getCompanies } from "@/lib/data-utils"
import { toast } from "@/hooks/use-toast"

export default function CompanyList() {
  const [companies, setCompanies] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        setIsLoading(true)
        const companiesData = await getCompanies()
        setCompanies(Array.isArray(companiesData) ? companiesData : [])
      } catch (error) {
        console.error("Error fetching companies:", error)
        toast({
          title: "Error",
          description: "Failed to load companies. Please try again.",
          variant: "destructive",
        })
        setCompanies([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchCompanies()
  }, [])

  if (isLoading) {
    return <div className="text-center py-12">Loading companies...</div>
  }

  if (!companies.length) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium">No companies found</h3>
        <p className="text-muted-foreground mt-2">Check back later for company information</p>
      </div>
    )
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {companies.map((company) => (
        <Card key={company.id} className="flex flex-col">
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
      ))}
    </div>
  )
}

