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

        // Only show approved experiences
        const approvedExperiences = experiences.filter((exp) => exp.status === "approved")

        // Store all approved experiences
        setAllExperiences(approvedExperiences)

        // Initially display all approved experiences
        setDisplayedExperiences(approvedExperiences)
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

  // Apply filters when search params change
  useEffect(() => {
    if (isLoading || allExperiences.length === 0) return

    // Get search parameters
    const query = searchParams?.get("query")?.toLowerCase() || ""
    const branch = searchParams?.get("branch") || ""
    const company = searchParams?.get("company") || ""
    const year = searchParams?.get("year") || ""
    const type = searchParams?.get("type") || ""

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

    // Update displayed experiences
    setDisplayedExperiences(filtered)
  }, [searchParams, isLoading, allExperiences]) // Dependencies: searchParams, loading state, and all experiences

  if (isLoading) {
    return <div className="text-center py-12">Loading experiences...</div>
  }

  if (displayedExperiences.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium">No experiences found</h3>
        <p className="text-muted-foreground mt-2">Try adjusting your filters or search criteria</p>
        <Button asChild className="mt-4">
          <Link href="/submit">Share Your Experience</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {displayedExperiences.map((experience) => (
        <Card key={experience.id} className="flex flex-col">
          <CardHeader className="pb-4">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-2">
                <Avatar>
                  <AvatarImage src={experience.profileImage} alt={experience.studentName} />
                  <AvatarFallback>{experience.studentName.substring(0, 2)}</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-lg">{experience.studentName}</CardTitle>
                  <CardDescription>{experience.branch}</CardDescription>
                </div>
              </div>
              <Image
                src={experience.companyLogo || "/placeholder.svg"}
                alt={`${experience.company} logo`}
                width={40}
                height={40}
                className="rounded-md"
              />
            </div>
          </CardHeader>
          <CardContent className="flex-1">
            <div className="flex flex-wrap gap-2 mb-3">
              <Badge variant="outline">{experience.company}</Badge>
              <Badge variant="secondary">{experience.type}</Badge>
              <Badge variant="outline">{experience.year}</Badge>
              {experience.role && (
                <Badge variant="outline" className="bg-primary/10">
                  {experience.role}
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground line-clamp-4">{experience.excerpt}</p>
          </CardContent>
          <CardFooter>
            <Button asChild variant="ghost" className="w-full">
              <Link href={`/experiences/${experience.id}`} className="flex items-center justify-between">
                <span>Read Full Experience</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}

