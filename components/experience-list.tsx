"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { getExperiences } from "@/lib/data-utils"
import { toast } from "@/hooks/use-toast"

export type Experience = {
  id: number
  studentName: string
  branch: string
  company: string
  companyType?: string
  year: number
  type: string
  excerpt: string
  profileImage: string
  companyLogo: string
  status: "pending" | "approved" | "rejected"
  linkedIn?: string
  github?: string
  personalEmail?: string
  preparationStrategy?: string
  interviewProcess?: string
  tips?: string
  challenges?: string
  resources?: Array<{ title: string; url: string }>
  role?: string
  submittedAt?: string
}

export default function ExperienceList() {
  const searchParams = useSearchParams()
  const [displayedExperiences, setDisplayedExperiences] = useState<Experience[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [allExperiences, setAllExperiences] = useState<Experience[]>([])

  // Load experiences on mount
  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        setIsLoading(true)
        // Get experiences from Firestore
        const experiences = await getExperiences()

        // Store all experiences (will already be filtered for non-admin users in getExperiences)
        setAllExperiences(experiences)

        // Initially display all experiences
        setDisplayedExperiences(experiences)
      } catch (error) {
        console.error("Error loading experiences:", error)
        toast({
          title: "Error",
          description: "Failed to load experiences. Please try again.",
          variant: "destructive",
        })
        setAllExperiences([])
        setDisplayedExperiences([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchExperiences()
  }, []) // Empty dependency array - only run once on mount

  // Update the filter effect to include company type
  useEffect(() => {
    if (isLoading || allExperiences.length === 0) return

    // Get search parameters
    const query = searchParams?.get("query")?.toLowerCase() || ""
    const branch = searchParams?.get("branch") || ""
    const company = searchParams?.get("company") || ""
    const year = searchParams?.get("year") || ""
    const type = searchParams?.get("type") || ""
    const companyType = searchParams?.get("companyType") || ""

    // Apply filters
    let filtered = [...allExperiences]

    // Filter by search query
    if (query) {
      filtered = filtered.filter(
        (exp) =>
          exp.studentName.toLowerCase().includes(query) ||
          exp.company.toLowerCase().includes(query) ||
          (exp.excerpt && exp.excerpt.toLowerCase().includes(query)),
      )
    }

    // Filter by branch
    if (branch && branch !== "all") {
      filtered = filtered.filter((exp) => exp.branch.toLowerCase().replace(/\s+/g, "-") === branch)
    }

    // Filter by company
    if (company && company !== "all") {
      filtered = filtered.filter((exp) => exp.company.toLowerCase().replace(/\s+/g, "-") === company)
    }

    // Filter by year
    if (year && year !== "all") {
      filtered = filtered.filter((exp) => exp.year.toString() === year)
    }

    // Filter by placement type
    if (type && type !== "all") {
      filtered = filtered.filter((exp) => exp.type.toLowerCase().replace(/\s+/g, "-") === type)
    }

    // Filter by company type
    if (companyType && companyType !== "all") {
      filtered = filtered.filter(
        (exp) => exp.companyType && exp.companyType.toLowerCase().replace(/\s+/g, "-") === companyType,
      )
    }

    // Update displayed experiences
    setDisplayedExperiences(filtered)
  }, [searchParams, isLoading, allExperiences])

  if (isLoading) {
    return <div className="text-center py-8 sm:py-12 text-sm sm:text-base">Loading experiences...</div>
  }

  if (displayedExperiences.length === 0) {
    return (
      <div className="text-center py-8 sm:py-12">
        <h3 className="text-base sm:text-lg font-medium">No experiences found</h3>
        <p className="text-xs sm:text-sm text-muted-foreground mt-2">Try adjusting your filters or search criteria</p>
        <Button asChild className="mt-4">
          <Link href="/submit">Share Your Experience</Link>
        </Button>
      </div>
    )
  }

  // Add helper function to get company type name
  function getCompanyTypeName(value: string): string {
    const typeMap: Record<string, string> = {
      tech: "Tech",
      finance: "Finance",
      core: "Core",
      product: "Product",
      service: "Service",
      consulting: "Consulting",
      ecommerce: "E-Commerce",
      healthcare: "Healthcare",
      manufacturing: "Manufacturing",
      other: "Other",
    }
    return typeMap[value] || value
  }

  return (
    <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      {displayedExperiences.map((experience) => (
        <Card key={experience.id} className="flex flex-col overflow-hidden">
          <CardHeader className="p-3 sm:p-4 pb-2 sm:pb-4">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8 sm:h-10 sm:w-10">
                  <AvatarImage src={experience.profileImage} alt={experience.studentName} />
                  <AvatarFallback>{experience.studentName.substring(0, 2)}</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-sm sm:text-lg line-clamp-1">{experience.studentName}</CardTitle>
                  <CardDescription className="text-xs sm:text-sm line-clamp-1">{experience.branch}</CardDescription>
                </div>
              </div>
              <Image
                src={experience.companyLogo || "/placeholder.svg"}
                alt={`${experience.company} logo`}
                width={32}
                height={32}
                className="rounded-md h-8 w-8 sm:h-10 sm:w-10 object-contain"
              />
            </div>
          </CardHeader>
          <CardContent className="flex-1 p-3 sm:p-4 pt-0 sm:pt-0">
            <div className="flex flex-wrap gap-1 sm:gap-2 mb-2 sm:mb-3">
              <Badge variant="outline" className="text-[10px] sm:text-xs px-1.5 py-0 h-5">
                {experience.company}
              </Badge>
              <Badge variant="secondary" className="text-[10px] sm:text-xs px-1.5 py-0 h-5">
                {experience.type}
              </Badge>
              <Badge variant="outline" className="text-[10px] sm:text-xs px-1.5 py-0 h-5">
                {experience.year}
              </Badge>
              {experience.companyType && (
                <Badge
                  variant="outline"
                  className="text-[10px] sm:text-xs px-1.5 py-0 h-5 bg-blue-100 dark:bg-blue-900/30 nith-theme:bg-gold/20"
                >
                  {getCompanyTypeName(experience.companyType)}
                </Badge>
              )}
              {experience.role && (
                <Badge variant="outline" className="text-[10px] sm:text-xs px-1.5 py-0 h-5 bg-primary/10">
                  {experience.role}
                </Badge>
              )}
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground line-clamp-3 sm:line-clamp-4">
              {experience.excerpt}
            </p>
          </CardContent>
          <CardFooter className="p-3 sm:p-4">
            <Button asChild variant="ghost" className="w-full h-8 sm:h-9 text-xs sm:text-sm">
              <Link href={`/experiences/${experience.id}`} className="flex items-center justify-between">
                <span>Read Full Experience</span>
                <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}

