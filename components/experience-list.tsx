"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { ArrowRight, Lock, Clock } from "lucide-react"
import { getExperiences } from "@/lib/data-utils"
import { toast } from "@/hooks/use-toast"
import { Skeleton } from "@/components/ui/skeleton"
import { useAuth } from "@/contexts/auth-context"
import AuthGuard from "@/components/auth-guard"

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
  package?: string
  uid?: string
}

export default function ExperienceList() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { user, isAdmin, isAuthenticated, loading } = useAuth()
  const [displayedExperiences, setDisplayedExperiences] = useState<Experience[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [allExperiences, setAllExperiences] = useState<Experience[]>([])
  const [showPreview, setShowPreview] = useState(true)

  // Load experiences on mount
  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        setIsLoading(true)
        console.log("ExperienceList: Fetching experiences...")

        // Get experiences from Firestore or mock data
        const experiences = await getExperiences()
        console.log(`ExperienceList: Fetched ${experiences.length} experiences`)

        // Store all experiences
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

        // Use mock data as fallback - ensure they're approved
        const mockExperiences = [
          {
            id: 1,
            studentName: "Rahul Sharma",
            branch: "Computer Science",
            company: "Microsoft",
            companyType: "tech",
            year: 2023,
            type: "On-Campus",
            excerpt:
              "The interview process consisted of 3 technical rounds and 1 HR round. The technical rounds focused on data structures, algorithms, and system design...",
            profileImage: "/placeholder.svg?height=100&width=100",
            companyLogo: "/placeholder.svg?height=40&width=40",
            status: "approved" as const,
            preparationStrategy: "I focused on strengthening my fundamentals in data structures and algorithms.",
            interviewProcess: "The interview process at Microsoft consisted of 3 technical rounds and 1 HR round.",
            tips: "Start your preparation early, at least 3-4 months before the placement season.",
            challenges:
              "The most challenging part was the system design round as I had limited experience in this area.",
            role: "Software Engineer",
          },
          {
            id: 2,
            studentName: "Priya Patel",
            branch: "Electronics & Communication",
            company: "Amazon",
            companyType: "tech",
            year: 2023,
            type: "On-Campus",
            excerpt:
              "Preparation for Amazon required strong fundamentals in data structures and algorithms. The interview process was rigorous with 4 rounds...",
            profileImage: "/placeholder.svg?height=100&width=100",
            companyLogo: "/placeholder.svg?height=40&width=40",
            status: "approved" as const,
            preparationStrategy:
              "I prepared for Amazon by focusing on their leadership principles alongside technical skills.",
            interviewProcess:
              "Amazon's interview process had 4 rounds: an online assessment followed by 3 interview rounds.",
            tips: "For Amazon, understand their leadership principles thoroughly.",
            challenges:
              "The biggest challenge was balancing technical preparation with behavioral question preparation.",
            role: "Software Development Engineer",
          },
        ]

        setAllExperiences(mockExperiences)
        setDisplayedExperiences(mockExperiences)
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

    // For non-admin and non-authenticated users, only show approved experiences
    if (!isAdmin && !isAuthenticated) {
      filtered = filtered.filter((exp) => exp.status === "approved")
    } else if (!isAdmin && isAuthenticated) {
      // For authenticated non-admin users, show approved experiences and their own pending/rejected experiences
      filtered = filtered.filter(
        (exp) => exp.status === "approved" || (exp.uid === user?.uid && ["pending", "rejected"].includes(exp.status)),
      )
    }

    // Update displayed experiences
    setDisplayedExperiences(filtered)
  }, [searchParams, isLoading, allExperiences, isAdmin, isAuthenticated, user])

  // For non-authenticated users, show a preview with limited experiences
  useEffect(() => {
    if (!loading) {
      setShowPreview(!isAuthenticated)
    }
  }, [isAuthenticated, loading])

  // Handle login redirect
  const handleLoginRedirect = () => {
    router.push(`/auth/login?redirectTo=${encodeURIComponent(window.location.pathname)}`)
  }

  if (isLoading) {
    return (
      <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Card key={i} className="flex flex-col overflow-hidden">
            <CardHeader className="p-3 sm:p-4 pb-2 sm:pb-4">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-8 w-8 sm:h-10 sm:w-10 rounded-full" />
                  <div>
                    <Skeleton className="h-4 sm:h-5 w-24 sm:w-32 mb-1" />
                    <Skeleton className="h-3 sm:h-4 w-20 sm:w-24" />
                  </div>
                </div>
                <Skeleton className="h-8 w-8 sm:h-10 sm:w-10 rounded-md" />
              </div>
            </CardHeader>
            <CardContent className="flex-1 p-3 sm:p-4 pt-0 sm:pt-0">
              <div className="flex flex-wrap gap-1 sm:gap-2 mb-2 sm:mb-3">
                <Skeleton className="h-4 sm:h-5 w-16 sm:w-20" />
                <Skeleton className="h-4 sm:h-5 w-20 sm:w-24" />
                <Skeleton className="h-4 sm:h-5 w-12 sm:w-16" />
              </div>
              <Skeleton className="h-3 sm:h-4 w-full mb-2" />
              <Skeleton className="h-3 sm:h-4 w-full mb-2" />
              <Skeleton className="h-3 sm:h-4 w-3/4" />
            </CardContent>
            <CardFooter className="p-3 sm:p-4">
              <Skeleton className="h-8 sm:h-9 w-full" />
            </CardFooter>
          </Card>
        ))}
      </div>
    )
  }

  // Show preview for non-authenticated users
  if (showPreview) {
    return (
      <div className="space-y-8">
        {/* Preview section with limited experiences */}
        <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {displayedExperiences.slice(0, 3).map((experience) => (
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
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground line-clamp-3 sm:line-clamp-4">
                  {experience.excerpt}
                </p>
              </CardContent>
              <CardFooter className="p-3 sm:p-4">
                <Button variant="ghost" className="w-full h-8 sm:h-9 text-xs sm:text-sm" onClick={handleLoginRedirect}>
                  <div className="flex items-center justify-between w-full">
                    <span>View Full Experience</span>
                    <div className="flex items-center">
                      <Lock className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                      <span>Login Required</span>
                    </div>
                  </div>
                </Button>
              </CardFooter>
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
                <h3 className="text-lg font-semibold">Login to Access All Experiences</h3>
                <p className="text-sm text-muted-foreground">
                  {displayedExperiences.length > 3
                    ? `${displayedExperiences.length - 3} more experiences available after login`
                    : "Full details and more experiences available after login"}
                </p>
              </div>
            </div>
            <Button onClick={handleLoginRedirect}>Login Now</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // For authenticated users, show all experiences
  return (
    <AuthGuard>
      {displayedExperiences.length === 0 ? (
        <div className="text-center py-8 sm:py-12">
          <h3 className="text-base sm:text-lg font-medium">No experiences found</h3>
          <p className="text-xs sm:text-sm text-muted-foreground mt-2">Try adjusting your filters or search criteria</p>
          <Button asChild className="mt-4">
            <Link href="/submit">Share Your Experience</Link>
          </Button>
        </div>
      ) : (
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
                  {experience.status === "pending" && (experience.uid === user?.uid || isAdmin) && (
                    <Badge
                      variant="outline"
                      className="text-[10px] sm:text-xs px-1.5 py-0 h-5 bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 flex items-center gap-1"
                    >
                      <Clock className="h-3 w-3" />
                      <span>Pending</span>
                    </Badge>
                  )}
                  {experience.status === "rejected" && (experience.uid === user?.uid || isAdmin) && (
                    <Badge variant="destructive" className="text-[10px] sm:text-xs px-1.5 py-0 h-5">
                      Rejected
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
      )}
    </AuthGuard>
  )
}

// Helper function to get company type name
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

